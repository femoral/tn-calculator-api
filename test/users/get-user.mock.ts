export const buildGetUserResponse = () => ({
  data: {
    id: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
    username: 'test1@test.com',
    balance: '10.55',
  },
});
export const buildGetUserRequest = (): any => ({
  params: {
    id: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
  },
  session: {
    userId: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
  },
});

export const buildGetUserWithDifferentIdRequest = (): any => ({
  params: {
    id: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
  },
  session: {
    userId: '462140c7-16ff-4e4d-864b-39561715a382',
  },
});

export const buildGetUserQueryResponse = () => ({
  rows: [
    {
      id: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
      username: 'test1@test.com',
      balance: '10.55',
    },
  ],
});
