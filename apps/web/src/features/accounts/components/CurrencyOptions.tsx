"use client";

import { CircularProgress } from "@mui/material";
import { apiClient } from "@/src/lib/api-client";
import useSWRImmutable from "swr/immutable";
import SecondaryButton from "@/src/components/shared/SecondaryButton";
import CurrencySearch from "./CurrencySearch";

export interface CurrencyType {
  code: string;
  name: string;
  symbol: string;
}

const fetcher = (url: string) =>
  apiClient
    .get<CurrencyType[]>(url, { timeout: 10000 })
    .then((res) => res.data);

export default function CurrencyOptions({
  onCloseCurrencyOptions,
}: {
  onCloseCurrencyOptions: () => void;
}) {
  const { data, error, isLoading, mutate } = useSWRImmutable<CurrencyType[]>(
    "/api/v1/currencies",
    fetcher,
    { shouldRetryOnError: false },
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <CircularProgress aria-label="Loading…" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-md">
        <p className="text-base font-medium">Failed to load currencies.</p>
        <p className="text-sm text-dark-subtle mt-xs mb-md">
          Please try again later.
        </p>
        <div className="w-max">
          <SecondaryButton
            type="button"
            text="Try again"
            textClassName="text-sm font-medium py-xs px-md"
            onClick={() => mutate()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-sm">
        <h1 className="text-lg font-bold text-center">
          Choose account currency
        </h1>
      </div>
      <CurrencySearch
        currencies={data}
        onCloseCurrencyOptions={onCloseCurrencyOptions}
      />
    </div>
  );
}
