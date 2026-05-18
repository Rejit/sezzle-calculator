type ResultPanelProps = {
  error: string;
  result: string;
};

export function ResultPanel({ error, result }: ResultPanelProps) {
  return (
    <section className="result-panel" aria-live="polite">
      <span>Result</span>
      <strong>{result}</strong>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
