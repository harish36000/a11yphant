import { createMock } from "@golevelup/ts-jest";
import { UserFactory } from "@tests/support/factories/models/user.factory";

import { SessionToken } from "@/authentication/interfaces/session-token.interface";
import { InputError } from "@/user/exceptions/input.error";
import { RegisterUserInput } from "@/user/inputs/register-user.input";
import { UserResolver } from "@/user/user.resolver";
import { UserService } from "@/user/user.service";

function createUserResolver(partials: { userService?: Partial<UserService> } = {}): UserResolver {
  const userService = createMock<UserService>({
    ...partials.userService,
  });

  return new UserResolver(userService);
}

describe("user resolver", () => {
  it("returns the current user", async () => {
    const user = UserFactory.build({ authProvider: "github" });
    const findById = jest.fn().mockResolvedValue(user);

    const resolver = createUserResolver({ userService: { findById } });
    const resolvedUser = await resolver.currentUser({ userId: "uuid" });

    expect(resolvedUser).toBeTruthy();
  });

  it("returns a user by id", async () => {
    const user = UserFactory.build();
    const findById = jest.fn().mockResolvedValue(user);

    const resolver = createUserResolver({ userService: { findById } });
    const resolvedUser = await resolver.user(user.id);

    expect(resolvedUser).toBeTruthy();
    expect(findById).toHaveBeenCalledWith(user.id);
  });

  it("shows that the user is registered for github users", async () => {
    const user = UserFactory.build({ authProvider: "github" });

    const resolver = createUserResolver();
    const resolvedIsRegistered = await resolver.isRegistered(user);

    expect(resolvedIsRegistered).toBeTruthy();
  });

  it("shows that the user is not registered for anonymous users", async () => {
    const user = UserFactory.build({ authProvider: "anonymous" });

    const resolver = createUserResolver();
    const resolvedIsRegistered = await resolver.isRegistered(user);

    expect(resolvedIsRegistered).toBeFalsy();
  });

  describe("register", () => {
    it("returns the registered user", async () => {
      const id = "test_id";
      const user = UserFactory.build({ id, authProvider: "local" });
      const registerUser = jest.fn().mockResolvedValue(user);

      const registerUserInput: RegisterUserInput = { email: "test", password: "test" };
      const sessionToken: SessionToken = { userId: "test" };

      const resolver = createUserResolver({ userService: { registerUser } });
      const resolvedUser = await resolver.register(registerUserInput, sessionToken);

      expect(resolvedUser).toBeTruthy();
      expect(registerUser).toHaveBeenCalledWith(registerUserInput, sessionToken.userId);
    });

    it("throws an input error if the service throws an error", () => {
      const registerUser = jest.fn().mockRejectedValue(new Error());
      const registerUserInput: RegisterUserInput = { email: "test", password: "test" };
      const sessionToken: SessionToken = { userId: "test" };

      const resolver = createUserResolver({ userService: { registerUser } });
      expect(resolver.register(registerUserInput, sessionToken)).rejects.toThrow(InputError);
    });
  });
});
