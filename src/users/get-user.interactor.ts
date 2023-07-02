import { User } from './user.model';

export type GetUserByIdRepository = (
  id: string,
  includeCredentials?: boolean
) => Promise<User>;

export type GetUserInteractor = (id: string) => Promise<User>;

export const makeGetUserInteractor =
  (dependencies: {
    getUserByIdRepository: GetUserByIdRepository;
  }): GetUserInteractor =>
  async (user) => {
    return await dependencies.getUserByIdRepository(user);
  };
