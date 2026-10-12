"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { FormFields } from "./NewAccountForm";
import { TextField } from "@mui/material";
import { getAccountIconByKey } from "@/src/utils/account-icons";
import AccountIconView from "@/src/components/shared/AccountIconView";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";

export default function AccountIconInput({
  onOpenIcons,
}: {
  onOpenIcons: () => void;
}) {
  const {
    control,
    formState: { isSubmitting, errors },
  } = useFormContext<FormFields>();

  const iconKey = useWatch({ control, name: "icon_key" });
  const selectedIcon = getAccountIconByKey(iconKey);

  return (
    <TextField
      value={selectedIcon?.name || "Unknown"}
      label="Icon"
      fullWidth
      id="icon-form-input"
      variant="outlined"
      helperText={errors.icon_key?.message}
      error={Boolean(errors.icon_key)}
      disabled={isSubmitting}
      onClick={onOpenIcons}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          onOpenIcons();
        }
      }}
      sx={{
        "& .MuiInputBase-input": {
          cursor: "pointer",
        },
      }}
      slotProps={{
        inputLabel: {
          shrink: true,
        },
        input: {
          readOnly: true,
          endAdornment: (
            <div className="flex items-center gap-xs cursor-pointer">
              <AccountIconView>
                {selectedIcon?.icon ? (
                  <selectedIcon.icon size={24} className="text-light" />
                ) : (
                  <BrokenImageOutlinedIcon
                    fontSize="small"
                    className="text-light"
                  />
                )}
              </AccountIconView>
            </div>
          ),
        },
      }}
    />
  );
}
