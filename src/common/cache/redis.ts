import * as redis from 'redis';
import {
  RedisClientOptions,
  RedisClientType,
  RedisDefaultModules,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from 'redis';

const DEFAULT_TTL = 60 * 10; // 10 minutes

let client: RedisClientType<
  RedisDefaultModules & RedisModules,
  RedisFunctions,
  RedisScripts
>;

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

const health = () => {
  return client.isOpen ? 'UP' : 'DOWN';
};

export type Cache = {
  get: typeof get;
  set: typeof set;
  del: typeof del;
  health: typeof health;
};

export const makeCache = async (
  options: RedisClientOptions
): Promise<Cache> => {
  client = redis.createClient(options);

  await client.connect();

  return {
    get,
    set,
    del,
    health,
  };
};
