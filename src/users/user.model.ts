export type CreateUserRequest = {
  username: string;
  password: string;
  balance: string;
};

export type User = {
  id: string;
  username: string;
  balance: string;
};
