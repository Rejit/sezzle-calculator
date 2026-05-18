import { OperationConfig } from './operations';

export function buildExpression(operation: OperationConfig, a: string, b: string) {
  if (operation.value === 'sqrt') {
    return `${operation.symbol}(${a || '0'})`;
  }

  return `${a || '0'} ${operation.symbol} ${b || '0'}`;
}
