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

export type FormFields = z.infer<typeof schema>;

const schema = z.object({
  account_type: z
    .string()
    .min(1, "Account type name is required.")
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
    .regex(
      /^(?:\d{1,16})(?:\.\d{1,4})?$/,
      "Enter a valid amount with up to 4 decimal places.",
    )
    .or(z.literal("")),
  opening_balance_sign: z.enum(["positive", "negative"]),
  currency_code: z.string().regex(/^[A-Z]{3}$/, "Select a valid currency."),
  icon_key: z.string().trim().min(1, "Select an icon.").max(100),
});

export default function NewAccountForm() {
  const methods = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      account_number: "",
      name: "",
      opening_balance_sign: "positive",
      account_type: "Cash",
    },
  });

  const {
    setError,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit: SubmitHandler<FormFields> = async (data) => {};

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold">Create new account</h1>
          <Button type="submit">
            <div className="flex justify-between items-center">
              <span>
                <CheckIcon sx={{ width: "1.25rem" }} />
              </span>
              <span>Save</span>
            </div>
          </Button>
        </div>
        <div className="mt-xl flex flex-col gap-lg">
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
                  errors.account_number ? errors.account_number.message : " "
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
        </div>
      </form>
    </FormProvider>
  );
}
