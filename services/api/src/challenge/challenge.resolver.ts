import { Args, ID, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { ChallengesArgs } from "./arg-types/challenges.args";
import { ChallengeService } from "./challenge.service";
import { LevelService } from "./level.service";
import { Challenge } from "./models/challenge.model";
import { Level } from "./models/level.model";

@Resolver(() => Challenge)
export class ChallengeResolver {
  constructor(private readonly challengeService: ChallengeService, private readonly levelService: LevelService) {}

  @Query(() => Challenge, { nullable: true })
  async challenge(@Args("id", { type: () => ID }) id: string): Promise<Challenge> {
    return this.challengeService.findOne(id);
  }

  @Query(() => Challenge, { nullable: true })
  async challengeBySlug(@Args("slug", { type: () => String }) slug: string): Promise<Challenge> {
    return this.challengeService.findOneBySlug(slug);
  }

  @Query(() => [Challenge], { description: "Get all existing challenges." })
  async challenges(@Args({ nullable: true }) { filter }: ChallengesArgs = {}): Promise<Challenge[]> {
    return this.challengeService.findAll(filter);
  }

  @ResolveField()
  async levels(@Parent() challenge: Challenge): Promise<Level[]> {
    return this.levelService.findForChallenge(challenge.id);
  }

  @ResolveField(() => Number, { description: "How many levels the challenge has." })
  async numberOfLevels(@Parent() challenge: Challenge): Promise<number> {
    return this.levelService.getNumberOfLevelsForChallenge(challenge.id);
  }
}
