export const buildGetUserQueryResponse = () => ({
  rows: [
    {
      id: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
      username: 'test1@test.com',
      balance: '10.55',
      password: 'hashedPassword',
    },
  ],
});

export const buildUserCredentials = (): any => ({
  body: {
    username: 'test1@test.com',
    password: 'password',
  },
});
