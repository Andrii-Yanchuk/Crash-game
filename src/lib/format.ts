export function formatAmount(amount: number) {
  return amount.toFixed(2);
}

export function formatUsd(amount: number) {
  return `${formatAmount(amount)} USD`;
}
