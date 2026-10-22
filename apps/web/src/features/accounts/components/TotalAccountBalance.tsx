"use client";

import Skeleton from "@mui/material/Skeleton";
import { formatMoney } from "@/src/utils/formatters";
import { useAccounts } from "../hooks/useAccounts";

export default function TotalAccountBalance() {
  const { data, isLoading } = useAccounts();

  if (isLoading) {
    return (
      <Skeleton
        variant="rounded"
        width={140}
        height={32}
        animation="wave"
        sx={{ bgcolor: "rgba(255, 255, 255, 0.3)", marginTop: "4px" }}
      />
    );
  }

  const totalBalance = data?.summary.total_balance ?? 0;
  const currencySymbol = data?.summary.currency_symbol;
  const currencyCode = data?.summary.currency_code;
  const formattedTotal = formatMoney(
    totalBalance,
    currencySymbol,
    currencyCode,
  );

  return (
    <h2 className="text-xl text-shadow-lg md:text-2xl lg:text-3xl font-bold">
      {formattedTotal.sign && <span>{formattedTotal.sign}</span>}
      {formattedTotal.symbol && <span>{formattedTotal.symbol}</span>}
      <span>{formattedTotal.amount}</span>
    </h2>
  );
}
