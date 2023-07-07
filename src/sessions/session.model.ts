import { User } from '../users/user.model';

export type UserCredentials = {
  username: string;
  password: string;
};

export type UserWithCredentials = User & {
  password: string;
};

export type Session = {
  token: string;
  user: UserWithCredentials;
};

export type SessionResponse = {
  user: User;
};
