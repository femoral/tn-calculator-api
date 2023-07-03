import { CreateUserRequest, User } from './user.model';

export type CreateUserRepository = (user: CreateUserRequest) => Promise<User>;

export type CreateUserInteractor = (user: CreateUserRequest) => Promise<User>;

export const makeCreateUserInteractor =
  (dependencies: { createUser: CreateUserRepository }): CreateUserInteractor =>
  async (user) => {
    return await dependencies.createUser(user);
  };
