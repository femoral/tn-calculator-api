import { Request } from 'express';

export const buildDeleteSessionRequest = (): Request =>
  ({
    cookies: {
      SESSION: 'sessionCookie',
    },
  } as unknown as Request);
