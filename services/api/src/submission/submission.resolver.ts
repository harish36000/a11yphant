import { Args, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { UserInputError } from "apollo-server-express";

import { SessionToken } from "@/authentication/session-token.decorator";
import { SessionToken as SessionTokenInterface } from "@/authentication/session-token.interface";
import { LevelService } from "@/challenge/level.service";
import { Level } from "@/challenge/models/level.model";

import { CreateSubmissionResult } from "./create-submission.result";
import { Submission } from "./models/submission.model";
import { SubmissionInput } from "./submission.input";
import { SubmissionService } from "./submission.service";

@Resolver(() => Submission)
export class SubmissionResolver {
  constructor(private readonly submissionService: SubmissionService, private readonly levelService: LevelService) {}

  @Mutation(() => Submission)
  async submit(@Args("submissionInput") submissionInput: SubmissionInput, @SessionToken() sessionToken: SessionTokenInterface): Promise<Submission> {
    const level = await this.levelService.findOne(submissionInput.levelId);

    if (!level) {
      throw new UserInputError(`Level to provided levelId not found: ${submissionInput.levelId}.`);
    }

    return this.submissionService.save({
      ...submissionInput,
      userId: sessionToken.userId,
    });
  }

  @Mutation(() => CreateSubmissionResult)
  async createSubmission(
    @Args("submissionInput") submissionInput: SubmissionInput,
    @SessionToken() sessionToken: SessionTokenInterface,
  ): Promise<CreateSubmissionResult> {
    const submission = await this.submissionService.save({ ...submissionInput, userId: sessionToken.userId });

    return {
      submission,
    };
  }

  @ResolveField()
  async level(@Parent() submission: Submission): Promise<Level> {
    return this.levelService.findOne(submission.levelId);
  }
}
