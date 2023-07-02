import { Password } from '../common/crypto/password';
import { UnauthorizedError } from '../common/error/errors';
import { UserCredentials, UserWithCredentials } from './session.model';
import { User } from '../users/user.model';

export type CreateSessionRepository = (user: User) => Promise<string>;
export type GetUserByUsernameRepository = (
  username: string
) => Promise<UserWithCredentials>;

export type CreateSessionInteractor = (
  credentials: UserCredentials
) => Promise<string>;

export const makeCreateSessionInteractor =
  (dependencies: {
    createSessionRepository: CreateSessionRepository;
    getUserByUsername: GetUserByUsernameRepository;
    password: Password;
  }): CreateSessionInteractor =>
  async (credentials) => {
    const user = await dependencies.getUserByUsername(credentials.username);

    if (
      !(await dependencies.password.verify(user.password, credentials.password))
    ) {
      throw new UnauthorizedError('Invalid credentials');
    }

    return await dependencies.createSessionRepository(user);
  };
