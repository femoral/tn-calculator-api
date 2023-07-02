import * as redis from 'redis';

const DEFAULT_TTL = 60 * 10; // 10 minutes

let client: redis.RedisClientType;

const get = async (key: string) => {
  const [, value] = await client
    .multi()
    .expire(key, DEFAULT_TTL)
    .get(key)
    .exec();

  return value ? JSON.parse(value as string) : undefined;
};

const set = async (key: string, value: unknown) => {
  await client.set(key, JSON.stringify(value), { EX: DEFAULT_TTL });
};

const del = async (key: string) => {
  await client.del(key);
};

export type Cache = {
  get: typeof get;
  set: typeof set;
  del: typeof del;
};

export const makeCache = async (environment: any): Promise<Cache> => {
  client = redis.createClient({
    ...environment.redis,
  });

  await client.connect();

  return {
    get,
    set,
    del,
  };
};
