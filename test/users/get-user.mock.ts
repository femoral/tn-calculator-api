import { Request } from 'express';
import { ApiResponse } from '../../src/common/api.types';
import { User } from '../../src/users/user.model';

export const buildGetUserResponse = () => ({
  data: {
    id: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
    username: 'test1@test.com',
    balance: '10.55',
  },
});
export const buildGetUserRequest = (): Request<
  { userId: string },
  ApiResponse<User>,
  void,
  unknown
> =>
  ({
    params: {
      userId: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
    },
    session: {
      userId: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
    },
  } as unknown as Request<
    { userId: string },
    ApiResponse<User>,
    void,
    unknown
  >);

export const buildGetUserWithDifferentIdRequest = (): Request<
  { userId: string },
  ApiResponse<User>,
  void,
  unknown
> =>
  ({
    params: {
      userId: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
    },
    session: {
      userId: '462140c7-16ff-4e4d-864b-39561715a382',
    },
  } as unknown as Request<
    { userId: string },
    ApiResponse<User>,
    void,
    unknown
  >);

export const buildGetUserQueryResponse = () => ({
  rows: [
    {
      id: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
      username: 'test1@test.com',
      balance: '10.55',
    },
  ],
});
