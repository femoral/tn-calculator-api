import { RequestHandler } from 'express';

export const withErrorHandling =
  <P, ResBody, ReqBody, ReqQuery>(
    controller: RequestHandler<P, ResBody, ReqBody, ReqQuery>
  ): RequestHandler<P, ResBody, ReqBody, ReqQuery> =>
  async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (e) {
      next(e);
    }
  };
