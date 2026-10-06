"use client";

import { Backdrop, InputAdornment, TextField } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";
import BackDropView from "@/src/components/ui/BackDropView";

import AddNewAccountType from "./AddNewAccountType";
import { useFormContext, useWatch } from "react-hook-form";
import { FormFields } from "./NewAccountForm";
import AccountTypeOptions from "./AccountTypeOptions";

export default function AccountTypeInput() {
  const [openAccountTypes, setOpenAccountTypes] = useState(false);
  const { control } = useFormContext<FormFields>();

  const handleCloseTypes = () => {
    setOpenAccountTypes(false);
  };
  const handleOpenTypes = () => {
    setOpenAccountTypes(true);
  };

  const accountType = useWatch({
    control,
    name: "account_type",
  });

  return (
    <div>
      <TextField
        fullWidth
        label="Type"
        variant="outlined"
        value={accountType}
        onClick={handleOpenTypes}
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
      <Backdrop
        sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}
        open={openAccountTypes}
        onClick={handleCloseTypes}
      >
        <BackDropView>
          <div className="flex flex-col h-full">
            <div className="flex flex-none justify-between items-center mb-lg">
              <h1 className="text-lg font-bold">Choose account type</h1>
              <AddNewAccountType />
            </div>
            <div className="grow overflow-y-auto">
              <AccountTypeOptions onCloseTypes={handleCloseTypes} />
            </div>
          </div>
        </BackDropView>
      </Backdrop>
    </div>
  );
}
