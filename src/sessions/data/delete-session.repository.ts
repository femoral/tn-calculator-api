import { DeleteSessionRepository } from '../delete-session.interactor';
import { Cache } from '../../common/cache/redis';

export const makeDeleteSessionRepository =
  (dependencies: { cache: Cache }): DeleteSessionRepository =>
  async (token) => {
    await dependencies.cache.del(token);
  };
