"use client";

import { AccountIcon } from "@/src/utils/account-icons";
import { useFormContext } from "react-hook-form";
import { FormFields } from "./NewAccountForm";
import { List, ListItemButton, Radio } from "@mui/material";
import { memo } from "react";
import AccountIconView from "@/src/components/shared/AccountIconView";

function AccountIconOptions({
  accountIcons,
  onCloseIconOptions,
}: {
  accountIcons: AccountIcon[];
  onCloseIconOptions: () => void;
}) {
  const { setValue, watch } = useFormContext<FormFields>();
  const selectedIcon = watch("icon_key");

  return (
    <List disablePadding>
      {accountIcons.map((accountIcon) => {
        const isSelected = selectedIcon === accountIcon.key;
        return (
          <ListItemButton
            key={accountIcon.key}
            selected={isSelected}
            onClick={() => {
              setValue("icon_key", accountIcon.key, { shouldValidate: true });
              onCloseIconOptions();
            }}
            sx={{
              width: "100%",
              padding: "var(--spacing-xs) 0",
              justifyContent: "space-between",
              borderBottom: "2px solid var(--color-canvas)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "var(--color-brand-subtle)",
              },
            }}
          >
            <div className="flex items-center gap-sm text-sm">
              <AccountIconView>
                <accountIcon.icon size={24} className="text-light" />
              </AccountIconView>
              <span>{accountIcon.name}</span>
            </div>
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

export default memo(AccountIconOptions);
