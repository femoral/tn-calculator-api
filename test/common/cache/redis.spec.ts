import { makeCache, Cache } from '../../../src/common/cache/redis';

jest.mock('redis', () => {
  const storedValue = JSON.stringify({ key: 'value' });

  const multi = {
    expire: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([undefined, storedValue]),
  };

  const client = {
    multi: jest.fn().mockReturnValue(multi),
    get: jest.fn().mockResolvedValue(storedValue),
    set: jest.fn().mockResolvedValue(undefined),
    del: jest.fn().mockResolvedValue(undefined),
    isOpen: true,
    connect: jest.fn().mockResolvedValue(undefined),
  };

  return {
    createClient: jest.fn().mockReturnValue(client),
    __client: client,
    __multi: multi,
  };
});

describe('Redis', () => {
  let cache: Cache;
  const { createClient, __client, __multi } = jest.requireMock('redis');

  it('should call redis.createClient with redis url', async () => {
    cache = await makeCache({
      redis: {
        url: 'redis://localhost:6379',
      },
    });

    expect(createClient).toHaveBeenCalledWith({
      url: 'redis://localhost:6379',
    });
    expect(__client.connect).toHaveBeenCalled();
  });

  describe('get', () => {
    it('should call redis.multi with expire and get and return the value, when called', async () => {
      const value = await cache.get('key');

      expect(__client.multi).toHaveBeenCalledWith();
      expect(__multi.expire).toHaveBeenCalledWith('key', 600);
      expect(__multi.get).toHaveBeenCalledWith('key');
      expect(value).toEqual({ key: 'value' });
    });

    it('should return undefined, when value is not found', async () => {
      __multi.exec.mockResolvedValue([undefined, undefined]);

      const value = await cache.get('key');

      expect(value).toEqual(undefined);
    });
  });

  describe('set', () => {
    it('should call redis.set with key and value, when called', async () => {
      await cache.set('key', { key: 'value' });

      expect(__client.set).toHaveBeenCalledWith('key', '{"key":"value"}', {
        EX: 600,
      });
    });
  });

  describe('del', () => {
    it('should call redis.del with key, when called', async () => {
      await cache.del('key');

      expect(__client.del).toHaveBeenCalledWith('key');
    });
  });

  describe('health', () => {
    it('should return UP, when redis is connected', () => {
      const result = cache.health();

      expect(result).toEqual('UP');
    });

    it('should return DOWN, when redis is not connected', () => {
      __client.isOpen = false;

      const result = cache.health();

      expect(result).toEqual('DOWN');
    });
  });
});
