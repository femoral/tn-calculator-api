import { User } from '../users/user.model';

export type UserCredentials = {
  username: string;
  password: string;
};

export type UserWithCredentials = User & {
  password: string;
};
