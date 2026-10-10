import { cookies } from "next/headers";
import { Suspense } from "react";
import { revalidatePath } from "next/cache";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import ReplayIcon from "@mui/icons-material/Replay";

async function fetchAccounts() {
  const cookieStore = await cookies();
  const res = await fetch(`${process.env.FRONTEND_URL}/api/v1/accounts`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store", // Ensure fresh data on every request
  });

  if (!res.ok) {
    throw new Error("Failed to fetch accounts");
  }

  return res.json();
}

async function AccountsListContent() {
  try {
    const accounts = await fetchAccounts();

    return (
      <div className="flex flex-col gap-sm">
        {/* TODO: Implement the actual list of accounts here */}
        {/* Example:
        {accounts.map((account: any) => (
          <div key={account.id}>{account.name}</div>
        ))} 
        */}
      </div>
    );
  } catch (error) {
    async function retryAction() {
      "use server";
      revalidatePath("/accounts");
    }

    return (
      <div className="grow overflow-y-auto flex flex-col items-center justify-center p-md rounded-md bg-error-subtle/10 text-error">
        <p className="mb-xs font-medium">Failed to load accounts.</p>
        <form action={retryAction}>
          <Button
            type="submit"
            variant="outlined"
            color="error"
            startIcon={<ReplayIcon />}
            size="small"
          >
            Retry
          </Button>
        </form>
      </div>
    );
  }
}

export default function AccountsList() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-md">
          <CircularProgress size={24} />
          <span className="ml-xs text-dark-subtle">Loading accounts...</span>
        </div>
      }
    >
      <AccountsListContent />
    </Suspense>
  );
}
