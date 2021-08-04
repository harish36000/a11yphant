import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { LevelFactory } from "@tests/factories/database/level.factory";
import { SubmissionFactory } from "@tests/factories/database/submission.factory";
import { UserFactory } from "@tests/factories/database/user.factory";
import { useDatabase } from "@tests/helpers";

import { PrismaService } from "@/prisma/prisma.service";
import { SubmissionService } from "@/submission/submission.service";

describe("submission service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  describe("findOne", () => {
    it("finds a submission to a given id", async () => {
      const html = "<div>hello</div>";

      const prisma = getPrismaService();
      const service = new SubmissionService(
        prisma,
        createMock<ClientProxy>({ emit: jest.fn(() => ({ toPromise: jest.fn().mockResolvedValue(null) })) }),
      );

      const { id } = await prisma.submission.create({
        data: SubmissionFactory.build({ html }),
      });

      const submission = await service.findOne(id);

      expect(submission).toBeTruthy();
      expect(submission.html).toBe(html);
    });
  });

  describe("findLastForUserAndLevel", () => {
    it("finds submission for user and Level", async () => {
      const html = "<h1>a11yphant</h1>";

      const prisma = getPrismaService();
      const service = new SubmissionService(
        prisma,
        createMock<ClientProxy>({ emit: jest.fn(() => ({ toPromise: jest.fn().mockResolvedValue(null) })) }),
      );

      const {
        id: submissionId,
        userId,
        levelId,
      } = await prisma.submission.create({
        data: SubmissionFactory.build({ html }),
        include: {
          level: true,
        },
      });

      const submission = await service.findLastForUserAndLevel(userId, levelId);

      expect(submission).toBeTruthy();
      expect(submission.html).toBe(html);
      expect(submission.id).toBe(submissionId);
    });
  });

  describe("save", () => {
    it("can save a submission to a given level", async () => {
      const html = "<div>good morning :)</div>";

      const prisma = getPrismaService();
      const service = new SubmissionService(
        prisma,
        createMock<ClientProxy>({ emit: jest.fn(() => ({ toPromise: jest.fn().mockResolvedValue(null) })) }),
      );

      const { id: userId } = await prisma.user.create({
        data: UserFactory.build(),
      });

      const { id: levelId } = await prisma.level.create({
        data: LevelFactory.build(),
      });

      const createdSubmission = await service.save({
        levelId,
        userId,
        html,
        css: null,
        js: null,
      });

      expect(createdSubmission).toBeTruthy();
      expect(createdSubmission.html).toBe(html);

      const queriedSubmission = await prisma.submission.findUnique({
        where: {
          id: createdSubmission.id,
        },
        include: { result: true },
      });

      expect(queriedSubmission).toBeTruthy();
      expect(queriedSubmission.html).toBe(html);
      expect(queriedSubmission.result).toBeTruthy();
    });

    it("throws error if no level is found for id", async () => {
      const prisma = getPrismaService();
      const service = new SubmissionService(
        prisma,
        createMock<ClientProxy>({ emit: jest.fn(() => ({ toPromise: jest.fn().mockResolvedValue(null) })) }),
      );

      const { id: userId } = await prisma.user.create({
        data: UserFactory.build(),
      });

      expect(async () =>
        service.save({
          levelId: "badId",
          userId,
        }),
      ).rejects.toBeTruthy();
    });

    it("emits a submission.created event when a new submission is created", async () => {
      const emit = jest.fn(() => ({ toPromise: jest.fn().mockResolvedValue(null) }));

      const submission = {
        id: "uuid",
        html: "html",
        css: "css",
        js: "js",
        level: { requirements: [{ id: "some-uuid", rule: { key: "test-key" }, options: { selector: "ul > li" } }] },
      };
      const service = new SubmissionService(
        createMock<PrismaService>({
          submission: { create: jest.fn().mockResolvedValue(submission) },
        }),
        createMock<ClientProxy>({ emit }),
      );

      await service.save({ levelId: "uuid", html: "html", css: "css", js: "js", userId: "uuid" });

      expect(emit).toHaveBeenCalledWith(
        "submission.created",
        expect.objectContaining({
          submission: {
            id: submission.id,
            html: submission.html,
            css: submission.css,
            js: submission.js,
          },
          rules: expect.arrayContaining([
            expect.objectContaining({
              id: submission.level.requirements[0].id,
              key: submission.level.requirements[0].rule.key,
              options: submission.level.requirements[0].options,
            }),
          ]),
        }),
      );
    });
  });
});
