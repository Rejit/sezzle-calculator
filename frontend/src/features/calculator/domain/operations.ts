export type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'power' | 'sqrt' | 'percent';

export type OperationConfig = {
  value: Operation;
  label: string;
  symbol: string;
  needsSecondOperand: boolean;
};

export const operations: OperationConfig[] = [
  { value: 'add', label: 'Addition', symbol: '+', needsSecondOperand: true },
  { value: 'subtract', label: 'Subtraction', symbol: '-', needsSecondOperand: true },
  { value: 'multiply', label: 'Multiplication', symbol: 'x', needsSecondOperand: true },
  { value: 'divide', label: 'Division', symbol: '/', needsSecondOperand: true },
  { value: 'power', label: 'Exponentiation', symbol: '^', needsSecondOperand: true },
  { value: 'sqrt', label: 'Square root', symbol: 'sqrt', needsSecondOperand: false },
  { value: 'percent', label: 'Percentage', symbol: '%', needsSecondOperand: true },
];

export function getOperationConfig(operation: Operation) {
  return operations.find((item) => item.value === operation) ?? operations[0];
}
