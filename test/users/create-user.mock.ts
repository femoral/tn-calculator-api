export const buildCreateUserResponse = () => ({
  data: {
    id: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
    username: 'test1@test.com',
    balance: '10.55',
  },
});
export const buildCreateUserRequest = (): any => ({
  body: {
    username: 'test1@test.com',
    balance: '10.55',
    password: 'password',
  },
});
export const buildCreateUserQueryResponse = () => ({
  rows: [
    {
      id: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
      username: 'test1@test.com',
      balance: '10.55',
    },
  ],
});
