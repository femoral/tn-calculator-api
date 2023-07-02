import { Response } from 'express';

export const mockResponse = () => {
  const res = {} as Response;

  res.json = jest.fn();
  res.send = jest.fn();
  res.status = jest.fn(() => res);

  return res;
};
