import { Response } from 'express';

export const mockResponse = () => {
  const res = {} as Response;

  res.json = jest.fn();
  res.send = jest.fn();
  res.end = jest.fn();
  res.clearCookie = jest.fn(() => res);
  res.cookie = jest.fn(() => res);
  res.status = jest.fn(() => res);

  return res;
};
