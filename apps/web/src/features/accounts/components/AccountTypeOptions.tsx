"use client";

import { Controller, useFormContext } from "react-hook-form";
import useSWR from "swr";
import { FormFields } from "./NewAccountForm";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import SecondaryButton from "@/src/components/shared/SecondaryButton";

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
  const { control } = useFormContext<FormFields>();

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

  const accountTypes = (data?.map((d) => d.name) || []).sort();

  return (
    <div>
      <Controller
        control={control}
        name="account_type"
        render={({ field }) => (
          <RadioGroup
            {...field}
            aria-labelledby="account-types"
            name="account-types-radio-group"
            sx={{
              flexWrap: "nowrap",
            }}
          >
            {accountTypes.map((accountType) => {
              return (
                <FormControlLabel
                  key={accountType}
                  value={accountType}
                  control={<Radio />}
                  label={accountType}
                  labelPlacement="start"
                  sx={{
                    width: "100%",
                    padding: "var(--spacing-xs)",
                    justifyContent: "space-between",
                    margin: 0,
                    borderBottom: "2px solid var(--color-canvas)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "var(--color-brand-subtle)",
                      cursor: "pointer",
                    },
                  }}
                  onChange={onCloseTypes}
                />
              );
            })}
          </RadioGroup>
        )}
      />
    </div>
  );
}
