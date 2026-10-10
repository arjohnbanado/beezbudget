export type MoneyStatus = "positive" | "negative" | "zero" | "not-set";

export interface FormattedMoney {
  formatted: string;
  status: MoneyStatus;
}

export function formatMoney(
  amount: number | string | null | undefined,
  currencySymbol?: string | null
): FormattedMoney {
  if (amount === null || amount === undefined || amount === "") {
    return { formatted: "Not set", status: "not-set" };
  }

  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return { formatted: "Not set", status: "not-set" };
  }

  const isNegative = numAmount < 0;
  const isZero = numAmount === 0;
  const absoluteAmount = Math.abs(numAmount);

  const formattedAmount = absoluteAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const symbol = currencySymbol || "";

  const formatted = isNegative
    ? `-${symbol}${formattedAmount}`
    : `${symbol}${formattedAmount}`;

  let status: MoneyStatus = "positive";
  if (isNegative) status = "negative";
  else if (isZero) status = "zero";

  return {
    formatted,
    status,
  };
}
