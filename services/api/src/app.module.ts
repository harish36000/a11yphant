import { AwsMessagingModule } from "@a11yphant/nestjs-aws-messaging";
import { PrismaModule } from "@a11yphant/prisma";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";

import { ChallengeModule } from "./challenge/challenge.module";
import apiConfig from "./config/api.config";
import databaseConfig from "./config/database.config";
import gqlConfig from "./config/gql.config";
import messaging from "./config/messaging.config";
import nodeConfig from "./config/node.config";
import { HelloWorldModule } from "./hello-world/hello-world.module";
import { SubmissionModule } from "./submission/submission.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [apiConfig, gqlConfig, nodeConfig, databaseConfig, messaging],
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        debug: configService.get<boolean>("gql.debug"),
        playground: configService.get<boolean>("gql.playground"),
        introspection: configService.get<boolean>("gql.schemaIntrospection"),
        autoSchemaFile: configService.get<boolean>("gql.inMemorySchema") ? true : "schema.gql",
        context: ({ req }) => ({ ...req }),
        cors: {
          credentials: true,
          origin: true,
        },
      }),
      inject: [ConfigService],
    }),
    PrismaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        databaseUrl: config.get<string>("database.url"),
      }),
      inject: [ConfigService],
    }),
    AwsMessagingModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        region: config.get<string>("messaging.region"),
        topics: config.get<Record<string, string>>("messaging.topics"),
        snsEndpoint: config.get<string>("messaging.sns-endpoint"),
      }),
      inject: [ConfigService],
    }),
    HelloWorldModule,
    ChallengeModule,
    SubmissionModule,
  ],
})
export class AppModule {}
