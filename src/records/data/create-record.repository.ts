import { Pool } from 'pg';
import { CreateRecordRepository } from '../execute-operation.interactor';
import Big from 'big.js';
import { UnprocessableEntityError } from '../../common/error/errors';
import { Record } from '../record.model';

const getUserBalanceStatement = `select balance from "user" where id = $1`;

const insertRecordStatement = `
  insert into "record" (operation_id, user_id, amount, user_balance, operation_response) 
  values ($1, $2, $3, $4, $5)
  returning id, user_id, operation_id, amount, user_balance, operation_response, date
`;

const updateUserBalanceStatement = `UPDATE "user" SET balance = $1 WHERE id = $2`;

export const makeCreateRecordRepository =
  (dependencies: { pool: Pool }): CreateRecordRepository =>
  async (record) => {
    const client = await dependencies.pool.connect();
    try {
      await client.query('BEGIN');

      const getUserBalanceResult = await client.query(getUserBalanceStatement, [
        record.user_id,
      ]);

      const remainingBalance = getRemainingBalance(
        getUserBalanceResult.rows[0].balance,
        record
      );

      const insertResult = await client.query(insertRecordStatement, [
        record.operation_id,
        record.user_id,
        record.amount,
        remainingBalance.toString(),
        record.operation_response,
      ]);

      await client.query(updateUserBalanceStatement, [
        remainingBalance.toString(),
        record.user_id,
      ]);

      await client.query('COMMIT');

      return {
        id: insertResult.rows[0].id,
        user_id: insertResult.rows[0].user_id,
        operation_id: insertResult.rows[0].operation_id,
        amount: insertResult.rows[0].amount,
        user_balance: insertResult.rows[0].user_balance,
        operation_response: insertResult.rows[0].operation_response,
        date: insertResult.rows[0].date,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  };

const getRemainingBalance = (userBalance: string, record: Partial<Record>) => {
  const remainingBalance = Big(userBalance).sub(Big(record.amount!));

  if (remainingBalance.lt(0))
    throw new UnprocessableEntityError('Insufficient funds');

  return remainingBalance;
};
