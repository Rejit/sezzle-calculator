export function formatResult(value: number) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
}

export function parseFiniteNumber(value: string) {
  if (value.trim() === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
