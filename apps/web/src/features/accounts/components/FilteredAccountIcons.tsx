"use client";

import { AccountIcon } from "@/src/utils/account-icons";
import { Controller, useFormContext } from "react-hook-form";
import { FormFields } from "./NewAccountForm";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { memo } from "react";
import AccountIconView from "@/src/components/shared/AccountIconView";

function AccountIconOptions({
  accountIcons,
  onCloseIconOptions,
}: {
  accountIcons: AccountIcon[];
  onCloseIconOptions: () => void;
}) {
  const { control } = useFormContext<FormFields>();

  return (
    <>
      <Controller
        control={control}
        name="icon_key"
        render={({ field }) => (
          <RadioGroup
            {...field}
            aria-labelledby="account-icons"
            name="account-icons-radio-group"
            sx={{
              flexWrap: "nowrap",
            }}
          >
            {accountIcons.map((accountIcon) => {
              return (
                <FormControlLabel
                  key={accountIcon.key}
                  value={accountIcon.key}
                  control={<Radio />}
                  label={
                    <div className="flex items-center gap-sm text-sm">
                      <AccountIconView>
                        <accountIcon.icon size={24} className="text-light" />
                      </AccountIconView>
                      <span>{accountIcon.name}</span>
                    </div>
                  }
                  labelPlacement="start"
                  sx={{
                    width: "100%",
                    padding: "var(--spacing-xs) 0",
                    justifyContent: "space-between",
                    margin: 0,
                    borderBottom: "2px solid var(--color-canvas)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "var(--color-brand-subtle)",
                      cursor: "pointer",
                    },
                  }}
                  onChange={onCloseIconOptions}
                />
              );
            })}
          </RadioGroup>
        )}
      />
    </>
  );
}

export default memo(AccountIconOptions);
