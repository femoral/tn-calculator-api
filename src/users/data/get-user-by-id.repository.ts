import { Pool } from 'pg';
import { NotFoundError } from '../../common/error/errors';
import { GetUserByIdRepository } from '../get-user.interactor';

const statement = `select id, username, balance from "user" where id = $1 and status = 'ENABLED'`;

export const makeGetUserByIdRepository =
  (dependencies: { pool: Pool }): GetUserByIdRepository =>
  async (id: string) => {
    const result = await dependencies.pool.query(statement, [id]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError('User not found');

    return {
      id: user.id,
      username: user.username,
      balance: user.balance,
    };
  };
