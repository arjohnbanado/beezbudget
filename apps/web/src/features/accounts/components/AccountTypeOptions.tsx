"use client";

import { useFormContext } from "react-hook-form";
import useSWR from "swr";
import { FormFields } from "./NewAccountForm";
import { List, ListItemButton, Radio } from "@mui/material";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import SecondaryButton from "@/src/components/shared/SecondaryButton";
import { customAlphabeticalSort } from "@/src/utils/sorting";

interface AccountType {
  name: string;
}

const fetcher = (url: string) =>
  axios
    .get<AccountType[]>(url, { withCredentials: true, timeout: 10000 })
    .then((res) => res.data);

export default function AccountTypeOptions({
  onCloseTypes,
}: {
  onCloseTypes: () => void;
}) {
  const { setValue, watch } = useFormContext<FormFields>();
  const selectedType = watch("account_type");

  const { data, error, isLoading, mutate } = useSWR<AccountType[]>(
    "/api/v1/accounts/types",
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
        <p className="text-base font-medium">Failed to load account types.</p>
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

  const accountTypes = (data?.map((d) => d.name) || []).sort(
    customAlphabeticalSort,
  );

  return (
    <List disablePadding>
      {accountTypes.map((accountType) => {
        const isSelected = selectedType === accountType;
        return (
          <ListItemButton
            key={accountType}
            selected={isSelected}
            onClick={() => {
              setValue("account_type", accountType, { shouldValidate: true });
              onCloseTypes();
            }}
            sx={{
              width: "100%",
              padding: "var(--spacing-xs)",
              justifyContent: "space-between",
              borderBottom: "2px solid var(--color-canvas)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "var(--color-brand-subtle)",
              },
            }}
          >
            <span className="text-sm font-medium">{accountType}</span>
            <Radio
              checked={isSelected}
              size="small"
              tabIndex={-1}
              disableRipple
            />
          </ListItemButton>
        );
      })}
    </List>
  );
}
