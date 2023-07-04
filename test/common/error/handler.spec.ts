import { withErrorHandling } from '../../../src/common/error/handler';
import { Request, RequestHandler, Response } from 'express';

describe('Error Handler', () => {
  const contorllerMock = jest.fn();
  let errorHandledController: RequestHandler;
  const req = {} as unknown as Request;
  const res = {} as unknown as Response;
  const next = jest.fn();

  beforeEach(() => {
    errorHandledController = withErrorHandling(contorllerMock);
  });

  it('should pass all arguments to the controller, when called', async () => {
    await errorHandledController(req, res, next);

    expect(contorllerMock).toHaveBeenCalledWith(req, res, next);
  });

  it('should call next with the error, when the controller rejects', async () => {
    const error = new Error('error');
    contorllerMock.mockRejectedValueOnce(error);

    await errorHandledController(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('should call next with the error, when the controller throws', async () => {
    const error = new Error('error');
    contorllerMock.mockImplementation(() => {
      throw error;
    });

    await errorHandledController(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
