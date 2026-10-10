import { cookies } from "next/headers";
import { Suspense } from "react";
import { retryFetchAccountsAction } from "../actions";
import SecondaryButton from "@/src/components/shared/SecondaryButton";
import Skeleton from "@mui/material/Skeleton";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AccountListItem from "./AccountListItem";

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

async function fetchAccounts(): Promise<Account[]> {
  const cookieStore = await cookies();
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/accounts`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch accounts");
  }

  // console.log(await res.json());
  return res.json();
}

async function AccountsListContent() {
  try {
    const accounts = await fetchAccounts();

    if (!accounts || accounts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center grow overflow-y-auto text-center p-md text-dark-subtle">
          <div className="relative mb-1">
            <AccountBalanceWalletOutlinedIcon
              sx={{ fontSize: 64, opacity: 0.5 }}
              className="text-subtle"
            />
            {/* Custom slash overlay since MUI doesn't have a WalletOff icon */}
            <div className="absolute top-1/2 left-1/2 w-[120%] h-2 bg-subtle opacity-50 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-white rounded-full"></div>
          </div>
          <p className="text-base font-medium text-dark">No accounts found</p>
          <p className="text-sm mt-xs">Create an account to get started.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-sm grow min-w-0 overflow-y-auto">
        {/* TODO: Implement the actual list of accounts here */}
        {/* Example: */}
        {accounts.map((account) => (
          <AccountListItem account={account} />
        ))}
      </div>
    );
  } catch (error) {
    console.log(error);
    return (
      <div className="flex flex-col items-center justify-center grow overflow-y-auto text-center p-md">
        <p className="text-base font-medium">Failed to load accounts.</p>
        <p className="text-sm text-dark-subtle mt-xs mb-md">
          Please try again later.
        </p>
        <form action={retryFetchAccountsAction}>
          <div className="w-max">
            <SecondaryButton
              type="submit"
              text="Try again"
              textClassName="text-sm font-medium py-xs px-md"
            />
          </div>
        </form>
      </div>
    );
  }
}

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
  return (
    <Suspense fallback={<AccountsListLoadingSkeleton />}>
      <AccountsListContent />
    </Suspense>
  );
}
