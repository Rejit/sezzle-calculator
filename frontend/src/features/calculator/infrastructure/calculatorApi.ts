import { Operation } from '../domain/operations';

export type CalculatePayload = {
  operation: Operation;
  a: number;
  b?: number;
};

export type CalculateResponse = {
  operation: Operation;
  result: number;
};

export type CalculateGateway = (payload: CalculatePayload) => Promise<CalculateResponse>;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export const calculate: CalculateGateway = async (payload) => {
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
};
