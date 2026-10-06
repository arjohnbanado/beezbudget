"use client";

import { Controller, useFormContext } from "react-hook-form";
import useSWR from "swr";
import { FormFields } from "./NewAccountForm";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

interface AccountType {
  name: string;
}
const builtInAccountTypes = ["Cash", "Bank", "E-wallet", "Card"];

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

  const { data, isLoading } = useSWR<AccountType[]>(
    "/api/v1/accounts/types",
    fetcher,
    { shouldRetryOnError: false, fallback: builtInAccountTypes },
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <CircularProgress aria-label="Loading…" />
      </div>
    );
  }

  const accountTypes = builtInAccountTypes
    .concat(data?.map((d) => d.name) || [])
    .sort();

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
