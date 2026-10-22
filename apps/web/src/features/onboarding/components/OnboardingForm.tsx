"use client";

import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { useRouter } from "next/navigation";
import useSWRImmutable from "swr/immutable";
import { useSWRConfig } from "swr";
import PrimaryButton from "@/src/components/shared/PrimaryButton";
import BackDropView from "@/src/components/ui/BackDropView";
import { apiClient } from "@/src/lib/api-client";
import { getApiErrorMessage } from "@/src/utils/errors";
import { detectUserCurrency } from "@/src/utils/currency-detector";
import type { CurrentUser } from "@/src/types/auth.types";
import PreferredCurrencyInput from "./PreferredCurrencyInput";
import OnboardingCurrencyOptions from "./OnboardingCurrencyOptions";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name must be 100 characters or fewer."),
  preferred_currency_code: z
    .string()
    .regex(/^[A-Z]{3}$/, "Select a valid currency."),
});

export type OnboardingFormFields = z.infer<typeof schema>;

const userFetcher = (url: string) =>
  apiClient.get<CurrentUser>(url).then((res) => res.data);

export default function OnboardingForm() {
  const [openCurrencies, setOpenCurrencies] = useState(false);
  const router = useRouter();
  const { mutate } = useSWRConfig();

  // Validates the session on mount and triggers token refresh if needed
  useSWRImmutable<CurrentUser>("/api/v1/users/me", userFetcher, {
    shouldRetryOnError: false,
  });

  const methods = useForm<OnboardingFormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      preferred_currency_code: "USD",
    },
  });

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting, dirtyFields },
  } = methods;

  useEffect(() => {
    if (!dirtyFields.preferred_currency_code) {
      setValue("preferred_currency_code", detectUserCurrency());
    }
  }, [dirtyFields.preferred_currency_code, setValue]);

  const onSubmit: SubmitHandler<OnboardingFormFields> = async (data) => {
    try {
      const response = await apiClient.patch<CurrentUser>(
        "/api/v1/users/me/onboarding",
        data,
      );

      mutate("/api/v1/users/me", response.data, false);
      router.push("/dashboard");
    } catch (error) {
      setError("root.serverError", {
        type: "server",
        message: getApiErrorMessage(error),
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-md mt-lg"
      >
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              id="onboarding-form-name-input"
              label="Your Name"
              placeholder="How should we call you?"
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

        <PreferredCurrencyInput
          onOpenCurrencies={() => setOpenCurrencies(true)}
        />

        <div className="flex flex-col gap-md mt-md">
          {errors.root?.serverError && (
            <p className="-mt-xs text-sm text-error text-center">
              {errors.root.serverError.message}
            </p>
          )}
          <PrimaryButton
            type="submit"
            text="Get Started"
            loading={isSubmitting}
          />
        </div>
      </form>

      <BackDropView
        open={openCurrencies}
        onClose={() => setOpenCurrencies(false)}
      >
        <OnboardingCurrencyOptions
          onCloseCurrencyOptions={() => setOpenCurrencies(false)}
        />
      </BackDropView>
    </FormProvider>
  );
}
