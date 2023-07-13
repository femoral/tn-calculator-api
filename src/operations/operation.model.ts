export type ArithmeticOperationType =
  | 'ADDITION'
  | 'SUBTRACTION'
  | 'MULTIPLICATION'
  | 'DIVISION'
  | 'SQUARE_ROOT';

export type StringOperationType = 'RANDOM_STRING';

export type OperationType = ArithmeticOperationType | StringOperationType;

export type Operation = {
  id: number;
  type: OperationType;
  cost: string;
  operands: number;
};

export type ArithmeticOperation = {
  operation_type: ArithmeticOperationType;
  operands: string[];
};

export type StringOperation = {
  operation_type: ArithmeticOperationType;
  operands: string[];
};

export type OperationExecution = ArithmeticOperation | StringOperation;
