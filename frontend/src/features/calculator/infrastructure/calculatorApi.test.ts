import { afterEach, describe, expect, it, vi } from 'vitest';
import { calculate } from './calculatorApi';

describe('calculate', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('posts calculator payloads and returns the response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ operation: 'multiply', result: 42 }),
    }));

    await expect(calculate({ operation: 'multiply', a: 7, b: 6 })).resolves.toEqual({
      operation: 'multiply',
      result: 42,
    });

    expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ operation: 'multiply', a: 7, b: 6 }),
    });
  });

  it('throws the API error message for unsuccessful responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'division by zero' }),
    }));

    await expect(calculate({ operation: 'divide', a: 1, b: 0 })).rejects.toThrow('division by zero');
  });

  it('throws a fallback message when the API omits an error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    }));

    await expect(calculate({ operation: 'add', a: 1, b: 1 })).rejects.toThrow('Unable to calculate result');
  });
});
