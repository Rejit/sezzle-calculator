export type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'power' | 'sqrt' | 'percent';

export type CalculatePayload = {
  operation: Operation;
  a: number;
  b?: number;
};

type CalculateResponse = {
  operation: Operation;
  result: number;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export async function calculate(payload: CalculatePayload): Promise<CalculateResponse> {
  const response = await fetch(`${API_BASE_URL}/calculate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? 'Unable to calculate result');
  }

  return data as CalculateResponse;
}
