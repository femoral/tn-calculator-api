import argon2 from 'argon2';

const hash = (password: string): Promise<string> => {
  return argon2.hash(password);
};

const verify = (hash: string, password: string): Promise<boolean> => {
  return argon2.verify(hash, password);
};

export type Password = {
  hash: typeof hash;
  verify: typeof verify;
};

export const makePassword = () => ({
  hash,
  verify,
});
