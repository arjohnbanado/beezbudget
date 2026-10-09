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
import axios from "axios";
import { useToast } from "@/src/providers/ToastProvider";
import { getApiErrorMessage } from "@/src/utils/errors";

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
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
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

      await axios.post("/api/v1/accounts", payload, {
        withCredentials: true,
      });

      if (onSuccess) {
        showToast({
          message: "Account saved successfully.",
          severity: "success",
        });
        reset();
        onSuccess();
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
          <AccountTypeInput />

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
          <OpeningBalanceInput />

          {/* ACCOUNT ICON */}
          <AccountIconInput />
        </div>
      </form>
    </FormProvider>
  );
}
