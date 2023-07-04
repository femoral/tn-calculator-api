import { Request, Response } from 'express';
import { makeErrorMiddleware } from '../../src/middleware/error.middleware';
import { buildKnownErrorScenarios, Scenario } from './error.middleware.mock';

describe('Error Middleware', () => {
  const errorMiddleware = makeErrorMiddleware();
  const req = {} as unknown as Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  describe('known errors', () => {
    buildKnownErrorScenarios().forEach((scenario: Scenario) => {
      it(`should return ${scenario.expected.code} and ${scenario.expected.body.metadata.error.code} when ${scenario.error.name} is thrown`, async () => {
        await errorMiddleware(scenario.error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(scenario.expected.code);
        expect(res.json).toHaveBeenCalledWith(scenario.expected.body);
      });
    });
  });

  describe('unknown errors', () => {
    it('should return 500 and INTERNAL_SERVER_ERROR when an unknown error is thrown', async () => {
      await errorMiddleware(new Error('unknown error'), req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        metadata: {
          error: {
            code: 'InternalServerError',
            message: 'Internal server error',
          },
        },
      });
    });
  });
});
