import { FormEvent } from 'react';
import { Operation, OperationConfig } from '../domain/operations';

type CalculatorFormProps = {
  expression: string;
  firstNumber: string;
  isLoading: boolean;
  operation: Operation;
  operations: OperationConfig[];
  secondNumber: string;
  selectedOperation: OperationConfig;
  onFirstNumberChange: (value: string) => void;
  onOperationChange: (operation: Operation) => void;
  onSecondNumberChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function CalculatorForm({
  expression,
  firstNumber,
  isLoading,
  operation,
  operations,
  secondNumber,
  selectedOperation,
  onFirstNumberChange,
  onOperationChange,
  onSecondNumberChange,
  onSubmit,
}: CalculatorFormProps) {
  return (
    <form className="calculator-form" onSubmit={onSubmit}>
      <label>
        Operation
        <select value={operation} onChange={(event) => onOperationChange(event.target.value as Operation)}>
          {operations.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <div className="input-grid">
        <label>
          First number
          <input
            inputMode="decimal"
            type="number"
            value={firstNumber}
            onChange={(event) => onFirstNumberChange(event.target.value)}
            placeholder="0"
          />
        </label>

        {selectedOperation.needsSecondOperand && (
          <label>
            Second number
            <input
              inputMode="decimal"
              type="number"
              value={secondNumber}
              onChange={(event) => onSecondNumberChange(event.target.value)}
              placeholder="0"
            />
          </label>
        )}
      </div>

      <div className="expression" aria-live="polite">
        {expression}
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Calculating...' : 'Calculate'}
      </button>
    </form>
  );
}
