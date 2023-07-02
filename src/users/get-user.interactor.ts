import { User } from './user.model';

export type GetUserRepository = (id: string) => Promise<User>;

export type GetUserInteractor = (id: string) => Promise<User>;

export const makeGetUserInteractor =
  (dependencies: { getUserRepository: GetUserRepository }): GetUserInteractor =>
  async (user) => {
    return await dependencies.getUserRepository(user);
  };
