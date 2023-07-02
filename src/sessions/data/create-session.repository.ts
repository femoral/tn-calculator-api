import { CreateSessionRepository } from '../create-session.interactor';
import { User } from '../../users/user.model';
import { Cache } from '../../common/cache/redis';
import crypto from 'node:crypto';

export const makeCreateSessionRepository =
  (dependencies: { cache: Cache }): CreateSessionRepository =>
  async (user: User) => {
    const sessionId = crypto.randomBytes(32).toString('hex');

    await dependencies.cache.set(sessionId, { userId: user.id });

    return sessionId;
  };
