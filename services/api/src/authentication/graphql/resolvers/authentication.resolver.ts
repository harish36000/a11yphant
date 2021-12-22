import { ConfigService } from "@nestjs/config";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { UserInputError } from "apollo-server-errors";

import { InvalidJwtException } from "@/authentication/exceptions/invalid-jwt.exception";
import { UserNotFoundException } from "@/authentication/exceptions/user-not-found.exception";
import { User } from "@/user/models/user.model";
import { UserService } from "@/user/user.service";

import { AuthenticationService } from "../../authentication.service";
import { LoginInput } from "../../inputs/login.input";
import { Context as IContext } from "../../interfaces/context.interface";
import { JwtService } from "../../jwt.service";
import { ResetPasswordErrorCodes } from "../enums/reset-password-error-codes.enum";
import { ValidatePasswordResetTokenResultEnum } from "../enums/validate-password-reset-token-result.enum";
import { ResetPasswordResult } from "../results/reset-password.result";
import { ValidatePasswordResetTokenResult } from "../results/validate-password-reset-token.result";

@Resolver()
export class AuthenticationResolver {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  @Mutation(() => User)
  async login(@Args("loginInput") loginInput: LoginInput, @Context() ctx: IContext): Promise<User> {
    const user = await this.authenticationService.login(loginInput).catch((e) => {
      throw new UserInputError(e.message);
    });

    const token = await this.jwtService.createSignedToken({ userId: user.id }, { subject: "session", expiresInSeconds: 3600 * 24 * 365 });
    ctx.res.cookie(this.config.get<string>("cookie.name"), token, this.config.get("cookie.defaultConfig"));

    return user;
  }

  @Mutation(() => ValidatePasswordResetTokenResult)
  async validatePasswordResetToken(@Args("token") token: string): Promise<ValidatePasswordResetTokenResult> {
    try {
      await this.authenticationService.validatePasswordResetToken(token);
    } catch (e) {
      if (e instanceof InvalidJwtException) {
        return {
          result: ValidatePasswordResetTokenResultEnum.INVALID_JWT,
        };
      }

      if (e instanceof UserNotFoundException) {
        return {
          result: ValidatePasswordResetTokenResultEnum.UNKNOWN_USER,
        };
      }
    }

    return {
      result: ValidatePasswordResetTokenResultEnum.VALID,
    };
  }

  @Mutation(() => ResetPasswordResult)
  async resetPassword(@Args("token") token: string, @Args("password") password: string): Promise<typeof ResetPasswordResult> {
    try {
      const userId = await this.authenticationService.resetPassword(token, password);

      return await this.userService.findById(userId);
    } catch (e) {
      if (e instanceof InvalidJwtException) {
        return {
          errorCode: ResetPasswordErrorCodes.INVALID_TOKEN,
        };
      }

      throw e;
    }
  }
}
