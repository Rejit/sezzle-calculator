import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

describe('App', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calculates using the backend API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ operation: 'add', result: 15 }),
    }));

    render(<App />);
    await userEvent.clear(screen.getByLabelText(/first number/i));
    await userEvent.type(screen.getByLabelText(/first number/i), '10');
    await userEvent.clear(screen.getByLabelText(/second number/i));
    await userEvent.type(screen.getByLabelText(/second number/i), '5');
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    await waitFor(() => expect(screen.getByText('15')).toBeInTheDocument());
    expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/calculate', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ operation: 'add', a: 10, b: 5 }),
    }));
  });

  it('calculates square roots without a second number', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ operation: 'sqrt', result: 4 }),
    }));

    render(<App />);
    await userEvent.selectOptions(screen.getByLabelText(/operation/i), 'sqrt');

    expect(screen.queryByLabelText(/second number/i)).not.toBeInTheDocument();
    expect(screen.getByText('sqrt(12)')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    await waitFor(() => expect(screen.getByText('4')).toBeInTheDocument());
    expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/calculate', expect.objectContaining({
      body: JSON.stringify({ operation: 'sqrt', a: 12 }),
    }));
  });

  it('shows the loading state while a request is pending', async () => {
    let resolveRequest: (value: unknown) => void = () => {};
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise((resolve) => {
      resolveRequest = resolve;
    })));

    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    expect(screen.getByRole('button', { name: /calculating/i })).toBeDisabled();

    resolveRequest({
      ok: true,
      json: async () => ({ operation: 'add', result: 15.5 }),
    });

    await waitFor(() => expect(screen.getByText('15.5')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /calculate/i })).toBeEnabled();
  });

  it('shows backend errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'division by zero' }),
    }));

    render(<App />);
    await userEvent.selectOptions(screen.getByLabelText(/operation/i), 'divide');
    await userEvent.clear(screen.getByLabelText(/second number/i));
    await userEvent.type(screen.getByLabelText(/second number/i), '0');
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('division by zero'));
  });

  it('shows fallback errors for unexpected failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue('network failed'));

    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong.'));
  });

  it('shows frontend validation errors', async () => {
    render(<App />);

    expect(screen.getByText('-')).toBeInTheDocument();

    await userEvent.clear(screen.getByLabelText(/first number/i));
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid first number.');
  });

  it('shows validation errors for the second number when required', async () => {
    render(<App />);
    await userEvent.clear(screen.getByLabelText(/second number/i));
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid second number.');
  });

  it('falls back to addition when the operation value is unsupported in state', () => {
    render(<App />);
    const operation = screen.getByLabelText(/operation/i);

    fireEvent.change(operation, { target: { value: 'modulo' } });

    expect(screen.getByText('12 + 3')).toBeInTheDocument();
  });

  it('toggles between light and dark themes', async () => {
    render(<App />);
    const shell = screen.getByRole('main');
    const toggle = screen.getByRole('button', { name: /switch to dark theme/i });

    expect(shell).toHaveAttribute('data-theme', 'light');
    expect(toggle).toHaveTextContent('☀');

    await userEvent.click(toggle);

    expect(shell).toHaveAttribute('data-theme', 'dark');
    expect(screen.getByRole('button', { name: /switch to light theme/i })).toHaveTextContent('☾');
  });
});
