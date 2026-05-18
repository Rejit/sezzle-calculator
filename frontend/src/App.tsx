import { FormEvent, useMemo, useState } from 'react';
import { calculate, Operation } from './services/calculatorApi';

const operations: Array<{ value: Operation; label: string; symbol: string; needsB: boolean }> = [
  { value: 'add', label: 'Addition', symbol: '+', needsB: true },
  { value: 'subtract', label: 'Subtraction', symbol: '-', needsB: true },
  { value: 'multiply', label: 'Multiplication', symbol: 'x', needsB: true },
  { value: 'divide', label: 'Division', symbol: '/', needsB: true },
  { value: 'power', label: 'Exponentiation', symbol: '^', needsB: true },
  { value: 'sqrt', label: 'Square root', symbol: 'sqrt', needsB: false },
  { value: 'percent', label: 'Percentage', symbol: '%', needsB: true },
];

export function App() {
  const [operation, setOperation] = useState<Operation>('add');
  const [a, setA] = useState('12');
  const [b, setB] = useState('3');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const selectedOperation = useMemo(
    () => operations.find((item) => item.value === operation) ?? operations[0],
    [operation],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setResult(null);

    const parsedA = parseFiniteNumber(a);
    const parsedB = parseFiniteNumber(b);

    if (parsedA === null) {
      setError('Enter a valid first number.');
      return;
    }

    if (selectedOperation.needsB && parsedB === null) {
      setError('Enter a valid second number.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await calculate({
        operation,
        a: parsedA,
        ...(selectedOperation.needsB ? { b: parsedB ?? 0 } : {}),
      });
      setResult(response.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="app-shell" data-theme={theme}>
      <section className="calculator-panel" aria-labelledby="calculator-heading">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Full-stack REST calculator</p>
            <h1 id="calculator-heading">Sezzle Calculator</h1>
          </div>

          <button
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            aria-pressed={theme === 'dark'}
            className="theme-toggle"
            type="button"
            onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
          >
            <span aria-hidden="true" className="theme-icon">
              {theme === 'light' ? '☀' : '☾'}
            </span>
          </button>
        </div>

        <form className="calculator-form" onSubmit={handleSubmit}>
          <label>
            Operation
            <select value={operation} onChange={(event) => setOperation(event.target.value as Operation)}>
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
                value={a}
                onChange={(event) => setA(event.target.value)}
                placeholder="0"
              />
            </label>

            {selectedOperation.needsB && (
              <label>
                Second number
                <input
                  inputMode="decimal"
                  type="number"
                  value={b}
                  onChange={(event) => setB(event.target.value)}
                  placeholder="0"
                />
              </label>
            )}
          </div>

          <div className="expression" aria-live="polite">
            {selectedOperation.value === 'sqrt'
              ? `${selectedOperation.symbol}(${a || '0'})`
              : `${a || '0'} ${selectedOperation.symbol} ${b || '0'}`}
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Calculating...' : 'Calculate'}
          </button>
        </form>

        <section className="result-panel" aria-live="polite">
          <span>Result</span>
          <strong>{result === null ? '-' : formatResult(result)}</strong>
          {error && <p role="alert">{error}</p>}
        </section>
      </section>
    </main>
  );
}

function formatResult(value: number) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
}

function parseFiniteNumber(value: string) {
  if (value.trim() === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
