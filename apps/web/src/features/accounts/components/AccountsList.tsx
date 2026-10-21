"use client";

import useSWR from "swr";
import { apiClient } from "@/src/lib/api-client";
import SecondaryButton from "@/src/components/shared/SecondaryButton";
import Skeleton from "@mui/material/Skeleton";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccountListItem from "./AccountListItem";
import { customAlphabeticalSort } from "@/src/utils/sorting";

export interface Account {
  id: string;
  name: string;
  account_type: string;
  account_number_last4: string | null;
  opening_balance: number | null;
  currency_symbol: string | null;
  currency_code: string;
  icon_key: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

const fetcher = (url: string) =>
  apiClient.get<Account[]>(url, { timeout: 10000 }).then((res) => res.data);

function AccountsListLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-sm grow overflow-y-auto">
      <Skeleton variant="rounded" height={80} animation="wave" />
      <Skeleton variant="rounded" height={80} animation="wave" />
      <Skeleton variant="rounded" height={80} animation="wave" />
    </div>
  );
}

export default function AccountsList() {
  const {
    data: accounts,
    error,
    isLoading,
    mutate,
  } = useSWR<Account[]>("/api/v1/accounts", fetcher, {
    shouldRetryOnError: false,
  });

  if (isLoading) {
    return <AccountsListLoadingSkeleton />;
  }

  if (error || !accounts) {
    return (
      <div className="flex flex-col items-center justify-center grow overflow-y-auto text-center p-md">
        <p className="text-base font-medium">Failed to load accounts.</p>
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

  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center grow overflow-y-auto text-center p-md text-dark-subtle">
        <div className="relative mb-1">
          <AccountBalanceWalletOutlinedIcon
            sx={{ fontSize: 64, opacity: 0.5 }}
            className="text-subtle"
          />
          <div className="absolute top-1/2 left-1/2 w-[120%] h-2 bg-subtle opacity-50 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-white rounded-full"></div>
        </div>
        <p className="text-base font-medium text-dark">No accounts found</p>
        <p className="text-sm mt-xs">Create an account to get started.</p>
      </div>
    );
  }

  // 1. Group accounts by account_type
  const groupedAccounts = accounts.reduce<Record<string, Account[]>>(
    (acc, account) => {
      const type = account.account_type || "Other";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(account);
      return acc;
    },
    {},
  );
  // 2. Sort groups alphabetically by account_type
  const sortedAccountTypes = Object.keys(groupedAccounts).sort((a, b) =>
    customAlphabeticalSort(a, b),
  );

  // 3. Sort account items within each group alphabetically by name
  sortedAccountTypes.forEach((type) => {
    groupedAccounts[type].sort((a, b) => customAlphabeticalSort(a.name, b.name));
  });

  return (
    <div className="flex flex-col gap-sm grow min-w-0 overflow-y-auto">
      {sortedAccountTypes.map((type) => (
        <Accordion
          key={type}
          defaultExpanded
          disableGutters
          sx={{
            "&:before": {
              display: "none",
            },
            "&:not(.Mui-expanded)": {
              borderBottom: "1px solid var(--color-canvas)",
            },
          }}
          elevation={0}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              margin: 0,
              minHeight: 0,
              "&.Mui-expanded": {
                minHeight: 0,
              },
              "& .MuiAccordionSummary-content": {
                margin: "0.5rem 0.15rem",
              },
              "& .MuiAccordionSummary-content.Mui-expanded": {
                margin: "0.5rem 0.15rem",
              },
              padding: "0 0.75rem 0 0",
            }}
          >
            <span className="font-semibold text-sm ">{type}</span>
          </AccordionSummary>
          <AccordionDetails className="p-0 flex flex-col">
            {groupedAccounts[type].map((account) => (
              <AccountListItem key={account.id} account={account} />
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
