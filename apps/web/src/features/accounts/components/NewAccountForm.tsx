"use client";

import { Button, TextField } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { z } from "zod";
import AccountTypeInput from "./AccountTypeInput";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import OpeningBalanceInput from "./OpeningBalanceInput";
import AccountIconInput from "./AccountIconInput";
import { apiClient } from "@/src/lib/api-client";
import { useToast } from "@/src/providers/ToastProvider";
import { getApiErrorMessage } from "@/src/utils/errors";
import { CloseOutlined } from "@mui/icons-material";
import { useSWRConfig } from "swr";
import { useState } from "react";
import BackDropView from "@/src/components/ui/BackDropView";
import AccountTypeOptions from "./AccountTypeOptions";
import AddNewAccountType from "./AddNewAccountType";
import CurrencyOptions from "./CurrencyOptions";
import AccountIconSearch from "./AccountIconSearch";

export type FormFields = z.infer<typeof schema>;

const schema = z.object({
  account_type: z
    .string()
    .min(1, "Account type is required.")
    .max(100, "Account type name must be 100 characters or fewer."),
  name: z
    .string()
    .trim()
    .min(1, "Account name is required.")
    .max(100, "Account name must be 100 characters or fewer."),
  account_number: z
    .string()
    .max(255, "Account number must be 255 characters or fewer."),
  opening_balance: z
    .string()
    .trim()
    .regex(/^(?:\d{1,16})(?:\.\d{1,2})?$/, "Enter a valid amount.")
    .or(z.literal("")),
  opening_balance_sign: z.enum(["positive", "negative"]),
  currency_code: z.string().regex(/^[A-Z]{3}$/, "Select a valid currency."),
  icon_key: z.string().trim().min(1, "Select an icon.").max(100),
});

export default function NewAccountForm({
  onCloseForm,
}: {
  onCloseForm?: () => void;
}) {
  const [openTypes, setOpenTypes] = useState(false);
  const [openCurrencies, setOpenCurrencies] = useState(false);
  const [openIcons, setOpenIcons] = useState(false);

  const methods = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      account_type: "",
      name: "",
      account_number: "",
      opening_balance: "",
      opening_balance_sign: "positive",
      currency_code: "PHP",
      icon_key: "wallet",
    },
  });
  const { showToast } = useToast();
  const { mutate } = useSWRConfig();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = methods;

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      let balance: number | null = null;
      if (data.opening_balance !== "") {
        balance = parseFloat(data.opening_balance);
        if (data.opening_balance_sign === "negative") {
          balance = -balance;
        }
      }

      const payload = {
        account_type: data.account_type,
        name: data.name,
        account_number: data.account_number,
        opening_balance: balance,
        currency_code: data.currency_code,
        icon_key: data.icon_key,
      };

      await apiClient.post("/api/v1/accounts", payload);

      mutate("/api/v1/accounts");

      if (onCloseForm) {
        showToast({
          message: "Account saved successfully.",
          severity: "success",
        });
        reset();
        onCloseForm();
      }
    } catch (error) {
      showToast({
        message: getApiErrorMessage(error),
        severity: "error",
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
        <div className="flex justify-between items-center">
          <Button
            type="button"
            disabled={isSubmitting}
            className="text-error"
            onClick={onCloseForm}
          >
            <div className="flex justify-between items-center">
              <span>
                <CloseOutlined sx={{ width: "1.25rem" }} />
              </span>
              <span className="hidden md:inline ml-xs">Cancel</span>
            </div>
          </Button>
          <h1 className="text-lg font-bold">Create new account</h1>
          <Button type="submit" disabled={isSubmitting}>
            <div className="flex justify-between items-center">
              <span>
                <CheckIcon sx={{ width: "1.25rem" }} />
              </span>
              <span>Save</span>
            </div>
          </Button>
        </div>
        <div className="my-lg flex flex-col gap-lg grow overflow-y-auto py-xs">
          {/* ACCOUNT TYPE */}
          <AccountTypeInput onOpenTypes={() => setOpenTypes(true)} />

          {/* ACCOUNT NAME */}
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <TextField
                {...field}
                label="Name"
                fullWidth
                id="add-new-account-form-name-input"
                variant="outlined"
                helperText={errors.name ? errors.name.message : ""}
                error={Boolean(errors.name)}
                disabled={isSubmitting}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            )}
          />

          {/* ACCOUNT NUMBER */}
          <Controller
            control={control}
            name="account_number"
            render={({ field }) => (
              <TextField
                {...field}
                label="Account number (optional)"
                fullWidth
                id="add-new-account-form-name-account-number"
                variant="outlined"
                helperText={
                  errors.account_number ? errors.account_number.message : ""
                }
                error={Boolean(errors.account_number)}
                disabled={isSubmitting}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            )}
          />
          {/* OPENING BALANCE */}
          <OpeningBalanceInput
            onOpenCurrencies={() => setOpenCurrencies(true)}
          />

          {/* ACCOUNT ICON */}
          <AccountIconInput onOpenIcons={() => setOpenIcons(true)} />
        </div>
      </form>

      {/* DIALOGS (siblings to <form>, inside <FormProvider>) */}
      <BackDropView open={openTypes} onClose={() => setOpenTypes(false)}>
        <div className="flex flex-col h-full">
          <div className="flex flex-none justify-between items-center mb-lg">
            <h1 className="text-lg font-bold">Choose account type</h1>
            <AddNewAccountType />
          </div>
          <div className="grow overflow-y-auto">
            <AccountTypeOptions onCloseTypes={() => setOpenTypes(false)} />
          </div>
        </div>
      </BackDropView>

      <BackDropView
        open={openCurrencies}
        onClose={() => setOpenCurrencies(false)}
      >
        <CurrencyOptions
          onCloseCurrencyOptions={() => setOpenCurrencies(false)}
        />
      </BackDropView>

      <BackDropView open={openIcons} onClose={() => setOpenIcons(false)}>
        <AccountIconSearch onCloseIconOptions={() => setOpenIcons(false)} />
      </BackDropView>
    </FormProvider>
  );
}
