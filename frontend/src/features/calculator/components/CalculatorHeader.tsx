type CalculatorHeaderProps = {
  isDarkTheme: boolean;
  onToggleTheme: () => void;
};

export function CalculatorHeader({ isDarkTheme, onToggleTheme }: CalculatorHeaderProps) {
  return (
    <div className="panel-header">
      <div>
        <p className="eyebrow">Full-stack REST calculator</p>
        <h1 id="calculator-heading">Sezzle Calculator</h1>
      </div>

      <button
        aria-label={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`}
        aria-pressed={isDarkTheme}
        className="theme-toggle"
        type="button"
        onClick={onToggleTheme}
      >
        <span aria-hidden="true" className="theme-icon">
          {isDarkTheme ? '☾' : '☀'}
        </span>
      </button>
    </div>
  );
}
