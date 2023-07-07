import { Request } from 'express';
import { SessionResponse } from '../../src/sessions/session.model';
import { ApiResponse } from '../../src/common/api.types';

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

export const buildUserCredentials = (): Request =>
  ({
    body: {
      username: 'test1@test.com',
      password: 'password',
    },
  } as unknown as Request);

export const buildSessionResponse = (): ApiResponse<SessionResponse> => ({
  data: {
    user: {
      id: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
      username: 'test1@test.com',
      balance: '10.55',
    },
  },
});
