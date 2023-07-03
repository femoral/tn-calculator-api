import { RequestHandler } from 'express';

export const withErrorHandling =
  (controller: RequestHandler): RequestHandler =>
  async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (e) {
      next(e);
    }
  };
