import { FormEvent, useMemo, useState } from 'react';
import { buildExpression } from '../domain/expression';
import { formatResult, parseFiniteNumber } from '../domain/numberFormatting';
import { getOperationConfig, Operation, operations } from '../domain/operations';
import { calculate, CalculateGateway } from '../infrastructure/calculatorApi';

type UseCalculatorOptions = {
  calculateResult?: CalculateGateway;
};

export function useCalculator({ calculateResult = calculate }: UseCalculatorOptions = {}) {
  const [operation, setOperation] = useState<Operation>('add');
  const [firstNumber, setFirstNumber] = useState('12');
  const [secondNumber, setSecondNumber] = useState('3');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedOperation = useMemo(() => getOperationConfig(operation), [operation]);
  const expression = buildExpression(selectedOperation, firstNumber, secondNumber);
  const formattedResult = result === null ? '-' : formatResult(result);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setResult(null);

    const parsedFirstNumber = parseFiniteNumber(firstNumber);
    const parsedSecondNumber = parseFiniteNumber(secondNumber);

    if (parsedFirstNumber === null) {
      setError('Enter a valid first number.');
      return;
    }

    if (selectedOperation.needsSecondOperand && parsedSecondNumber === null) {
      setError('Enter a valid second number.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await calculateResult({
        operation,
        a: parsedFirstNumber,
        ...(selectedOperation.needsSecondOperand ? { b: parsedSecondNumber ?? 0 } : {}),
      });
      setResult(response.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }

  return {
    error,
    expression,
    firstNumber,
    formattedResult,
    isLoading,
    operation,
    operations,
    secondNumber,
    selectedOperation,
    setFirstNumber,
    setOperation,
    setSecondNumber,
    submit: handleSubmit,
  };
}
