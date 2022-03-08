import { UserSample } from "./user";

// A post request should not contain an id.
export type UserCreationParams = Pick<UserSample, "email" | "name" | "phoneNumbers">;

export class UsersService {
  public get(id: number, name?: string): UserSample {
    return {
      id,
      email: "jane@doe.com",
      name: name ?? "Jane Doe",
      status: "Happy",
      phoneNumbers: [],
    };
  }

  public create(userCreationParams: UserCreationParams): UserSample {
    return {
      id: Math.floor(Math.random() * 10000), // Random
      status: "Happy",
      ...userCreationParams,
    };
  }
}