"use client";

import useSWR from "swr";
import { apiClient } from "@/src/lib/api-client";

export interface Account {
  id: string;
  name: string;
  account_type: string;
  account_number_last4: string | null;
  opening_balance: number | null;
  converted_opening_balance: number | null;
  currency_symbol: string | null;
  currency_code: string;
  icon_key: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface AccountsSummary {
  total_balance: number;
  currency_code: string;
  currency_symbol: string | null;
}

export interface AccountsResponse {
  summary: AccountsSummary;
  accounts: Account[];
}

const fetcher = (url: string) =>
  apiClient
    .get<AccountsResponse>(url, { timeout: 10000 })
    .then((res) => res.data);

export function useAccounts() {
  return useSWR<AccountsResponse>("/api/v1/accounts", fetcher, {
    shouldRetryOnError: false,
  });
}
