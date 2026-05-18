import { useState } from 'react';
import { useCalculator } from '../application/useCalculator';
import { CalculatorForm } from './CalculatorForm';
import { CalculatorHeader } from './CalculatorHeader';
import { ResultPanel } from './ResultPanel';

export function CalculatorPanel() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const calculator = useCalculator();
  const isDarkTheme = theme === 'dark';

  return (
    <main className="app-shell" data-theme={theme}>
      <section className="calculator-panel" aria-labelledby="calculator-heading">
        <CalculatorHeader
          isDarkTheme={isDarkTheme}
          onToggleTheme={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
        />

        <CalculatorForm
          expression={calculator.expression}
          firstNumber={calculator.firstNumber}
          isLoading={calculator.isLoading}
          operation={calculator.operation}
          operations={calculator.operations}
          secondNumber={calculator.secondNumber}
          selectedOperation={calculator.selectedOperation}
          onFirstNumberChange={calculator.setFirstNumber}
          onOperationChange={calculator.setOperation}
          onSecondNumberChange={calculator.setSecondNumber}
          onSubmit={calculator.submit}
        />

        <ResultPanel error={calculator.error} result={calculator.formattedResult} />
      </section>
    </main>
  );
}
