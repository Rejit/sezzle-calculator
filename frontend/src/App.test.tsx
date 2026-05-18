import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('calculates using the backend API', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ operation: 'add', result: 15 }),
    }) as unknown as typeof fetch;

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

  it('shows frontend validation errors', async () => {
    render(<App />);
    await userEvent.clear(screen.getByLabelText(/first number/i));
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid first number.');
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
