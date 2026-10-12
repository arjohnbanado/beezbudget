"use client";

import { InputAdornment, TextField } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useFormContext, useWatch } from "react-hook-form";
import { FormFields } from "./NewAccountForm";

export default function AccountTypeInput({
  onOpenTypes,
}: {
  onOpenTypes: () => void;
}) {
  const {
    control,
    formState: { isSubmitting, errors },
  } = useFormContext<FormFields>();

  const accountType = useWatch({
    control,
    name: "account_type",
  });

  return (
    <TextField
      disabled={isSubmitting}
      fullWidth
      label="Type"
      variant="outlined"
      value={accountType}
      onClick={onOpenTypes}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          onOpenTypes();
        }
      }}
      helperText={errors.account_type ? errors.account_type.message : ""}
      error={Boolean(errors.account_type)}
      slotProps={{
        inputLabel: {
          shrink: true,
        },
        input: {
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <ArrowDropDownIcon />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        "& .MuiInputBase-input": {
          cursor: "pointer",
        },
      }}
    />
  );
}
