import { Operator } from '../../records/execute-operation.interactor';
import { AxiosInstance } from 'axios';

export const makeStringOperator =
  (dependencies: { axios: AxiosInstance }): Operator =>
  async () => {
    const response = await dependencies.axios.get('/strings/', {
      params: {
        num: 1,
        len: 20,
        format: 'plain',
        digits: 'on',
        upperalpha: 'on',
        loweralpha: 'on',
      },
    });

    return response.data;
  };
