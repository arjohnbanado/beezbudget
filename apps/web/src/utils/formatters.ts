export type MoneyStatus = "positive" | "negative" | "zero" | "not-set";

export interface FormattedMoney {
  formatted: string;
  sign: "" | "-";
  symbol: string;
  currencyCode: string;
  amount: string;
  integerPart: string;
  decimalPart: string;
  status: MoneyStatus;
}

export function formatMoney(
  amount: number | string | null | undefined,
  currencySymbol?: string | null,
  currencyCode?: string | null,
): FormattedMoney {
  if (amount === null || amount === undefined || amount === "") {
    return {
      formatted: "Not set",
      sign: "",
      symbol: "",
      currencyCode: "",
      amount: "Not set",
      integerPart: "",
      decimalPart: "",
      status: "not-set",
    };
  }

  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return {
      formatted: "Not set",
      sign: "",
      symbol: "",
      currencyCode: "",
      amount: "Not set",
      integerPart: "",
      decimalPart: "",
      status: "not-set",
    };
  }

  const isNegative = numAmount < 0;
  const isZero = numAmount === 0;
  const absoluteAmount = Math.abs(numAmount);

  const formattedAmount = absoluteAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const [integerPart = "0", decimalPart = "00"] = formattedAmount.split(".");
  const sign: "" | "-" = isNegative ? "-" : "";
  const symbol = currencySymbol || "";
  const code = currencyCode || "";

  const formatted = `${sign}${symbol}${formattedAmount}`;

  let status: MoneyStatus = "positive";
  if (isNegative) status = "negative";
  else if (isZero) status = "zero";

  return {
    formatted,
    sign,
    symbol,
    currencyCode: code,
    amount: formattedAmount,
    integerPart,
    decimalPart,
    status,
  };
}
