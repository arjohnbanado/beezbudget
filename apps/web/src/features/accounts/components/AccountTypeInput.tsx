"use client";

import useSWR from "swr";
import {
  Backdrop,
  Button,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";
import BackDropView from "@/src/components/ui/BackDropView";

import AddNewAccountType from "./AddNewAccountType";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { FormFields } from "./NewAccountForm";
import AccountTypeOptions from "./AccountTypeOptions";
// import axios from "axios";

// interface AccountTypes {
//   id: string;
//   name: string;
// }

// const fetcher = (url: string) =>
//   axios
//     .get<AccountTypes[]>(url, { withCredentials: true, timeout: 10000 })
//     .then((res) => res.data);

export default function AccountTypeInput() {
  const [openAccountTypes, setOpenAccountTypes] = useState(false);
  const { control } = useFormContext<FormFields>();

  // const { data, error, isLoading } = useSWR<AccountTypes[]>(
  //   "/api/v1/accounts/types",
  //   fetcher,
  //   { shouldRetryOnError: false },
  // );

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

  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }

  // if (error) {
  //   return (
  //     <div>
  //       <Button type="button" variant="text">
  //         <span className="text-dark-subtle">
  //           Something went wrong. Click here to try again
  //         </span>
  //       </Button>
  //     </div>
  //   );
  // }

  // if (!data) {
  //   return <p>Empty</p>;
  // }

  // const getAccountLabelById = (id: string) => {
  //   const match = data.find((account) => account.id === id);
  //   return match ? match.name : "Unknown Account Type";
  // };

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
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold">Choose account type</h1>
              <AddNewAccountType />
            </div>
            <div className="grow overflow-y-auto">
              <AccountTypeOptions onCloseTypes={handleCloseTypes} />
            </div>
            {/* <Controller
              control={control}
              name="account_type_id"
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  aria-labelledby="account-types"
                  defaultValue="female"
                  name="account-types-radio-group"
                  sx={{ gap: "var(--spacing-lg)", mt: "var(--spacing-xl)" }}
                >
                  {data.map((accountType) => {
                    return (
                      <FormControlLabel
                        key={accountType.id}
                        value={accountType.id}
                        control={<Radio />}
                        label={accountType.name}
                        labelPlacement="start"
                        sx={{
                          width: "100%",
                          justifyContent: "space-between",
                          margin: 0,
                          borderBottom: "2px solid var(--color-canvas)",
                        }}
                      />
                    );
                  })}
                </RadioGroup>
              )}
            /> */}
          </div>
        </BackDropView>
      </Backdrop>
    </div>
  );
}
