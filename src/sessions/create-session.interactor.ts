import { Password } from '../common/crypto/password';
import { UnauthorizedError } from '../common/error/errors';
import { Session, UserCredentials, UserWithCredentials } from './session.model';
import { User } from '../users/user.model';

export type CreateSessionRepository = (user: User) => Promise<string>;
export type GetUserByUsernameRepository = (
  username: string
) => Promise<UserWithCredentials>;

export type CreateSessionInteractor = (
  credentials: UserCredentials
) => Promise<Session>;

export const makeCreateSessionInteractor =
  (dependencies: {
    createSession: CreateSessionRepository;
    getUserByUsername: GetUserByUsernameRepository;
    password: Password;
    dummyUser: UserWithCredentials;
  }): CreateSessionInteractor =>
  async (credentials) => {
    let user: UserWithCredentials;

    try {
      user = await dependencies.getUserByUsername(credentials.username);
    } catch (e) {
      //TODO: implement proper logging
      console.warn(
        'Failed to fetch user, using dummy to prevent user enumeration',
        e
      );
      user = dependencies.dummyUser;
    }

    if (
      !(await dependencies.password.verify(
        user.password,
        credentials.password
      )) ||
      user.id === 'dummy'
    ) {
      throw new UnauthorizedError('Invalid credentials');
    }

    return {
      token: await dependencies.createSession(user),
      user,
    };
  };
