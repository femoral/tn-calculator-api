import { makePassword } from '../../../src/common/crypto/password';
import argon2 from 'argon2';

jest.mock('argon2', () => ({
  __esModule: true,
  default: {
    hash: jest.fn().mockResolvedValue('hash'),
    verify: jest.fn().mockResolvedValue(true),
  },
}));

describe('Password', () => {
  const password = makePassword();

  describe('hash', () => {
    it('should call argon2.hash with password, when hash is called', async () => {
      await password.hash('password');

      expect(argon2.hash).toHaveBeenCalledWith('password');
    });

    it('should return hashed password, when hash is called', async () => {
      const hashedPassword = await password.hash('password');

      expect(hashedPassword).toEqual('hash');
    });
  });

  describe('verify', () => {
    it('should call argon2.verify with password and hash', async () => {
      await password.verify('hash', 'password');

      expect(argon2.verify).toHaveBeenCalledWith('hash', 'password');
    });

    it('should return true, when password is correct', async () => {
      const result = await password.verify('hash', 'password');

      expect(result).toEqual(true);
    });
  });
});
