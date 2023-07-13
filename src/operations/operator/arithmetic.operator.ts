import Big from 'big.js';
import {
  ArithmeticOperation,
  ArithmeticOperationType,
} from '../operation.model';
import { BadRequestError } from '../../common/error/errors';

export const makeArithmeticOperator =
  () => async (operation: ArithmeticOperation) => {
    return arithmeticOperationMap[operation.operation_type](
      operation.operands ?? []
    ).toString();
  };

const addition = (operands: string[]) => {
  return Big(operands[0]).add(Big(operands[1]));
};

const subtraction = (operands: string[]) => {
  return Big(operands[0]).sub(Big(operands[1]));
};

const multiplication = (operands: string[]) => {
  return Big(operands[0]).mul(Big(operands[1]));
};

const division = (operands: string[]) => {
  if (Big(operands[1]).eq(0))
    throw new BadRequestError('Division by zero is not allowed');

  return Big(operands[0]).div(Big(operands[1]));
};

const squareRoot = (operands: string[]) => {
  const operand = Big(operands[0]);

  if (operand.lt(0))
    throw new BadRequestError('Square root of negative number is not allowed');

  return operand.sqrt();
};

type ArithmeticOperationMap = {
  [key in ArithmeticOperationType]: (operands: string[]) => Big;
};

const arithmeticOperationMap: ArithmeticOperationMap = {
  ADDITION: addition,
  SUBTRACTION: subtraction,
  MULTIPLICATION: multiplication,
  DIVISION: division,
  SQUARE_ROOT: squareRoot,
};
