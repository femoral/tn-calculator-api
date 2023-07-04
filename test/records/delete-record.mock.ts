import { Request } from 'express';

export const buildDeleteRecordMock = (): Request<{
  userId: string;
  recordId: string;
}> => {
  return {
    params: {
      userId: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
      recordId: '11',
    },
    session: {
      userId: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
    },
  } as unknown as Request<{ userId: string; recordId: string }>;
};

export const buildDeleteRecordWithUnmatchedUserMock = (): Request<{
  userId: string;
  recordId: string;
}> => {
  return {
    params: {
      userId: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
      recordId: '11',
    },
    session: {
      userId: '462140c7-16ff-4e4d-864b-39561715a382',
    },
  } as unknown as Request<{ userId: string; recordId: string }>;
};
