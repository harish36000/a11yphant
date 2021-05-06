import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Level } from "../../challenge/models/level.model";

@ObjectType({
  description: "A submission of an user.",
})
export class Submission {
  constructor(properties: { id: string; html?: string; css?: string; js?: string; levelId: string }) {
    this.id = properties.id;
    this.levelId = properties.levelId;

    this.html = properties.html;
    this.css = properties.css;
    this.js = properties.js;
  }

  @Field(() => ID)
  id: string;

  @Field(() => Level, {
    description: "The level this submission is for.",
  })
  level: Level;

  levelId: string;

  @Field(() => String, {
    nullable: true,
    description: "HTML is formatted as a multi-line string with line breaks.",
  })
  html?: string;

  @Field(() => String, {
    nullable: true,
    description: "CSS is formatted as a multi-line string with line breaks.",
  })
  css?: string;

  @Field(() => String, {
    nullable: true,
    description: "JS is formatted as a multi-line string with line breaks.",
  })
  js?: string;
}
