"use client";

import PrimaryButton from "@/src/components/shared/PrimaryButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod/v4";
import { getApiErrorMessage } from "@/src/utils/errors";
import axios from "axios";
import { useRouter } from "next/navigation";

type FormFields = z.infer<typeof schema>;

const schema = z.object({
  email: z
    .email("Please enter a valid email address.")
    .max(320, "Email address is too long."),
});

export default function ForgotPasswordForm() {
  const {
    setError,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const response = await axios.post<{ id: string }>(
        "/api/v1/auth/forgot-password",
        data,
      );
      router.push(`/forgot-password/status?verificationId=${response.data.id}`);
    } catch (error) {
      setError("root.serverError", {
        type: "server",
        message: getApiErrorMessage(error),
      });
    }
  };

  return (
    <div className="mt-sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                id="forgot-password-form-email-input"
                label="Enter your email address"
                variant="outlined"
                helperText={errors.email ? errors.email.message : " "}
                error={Boolean(errors.email)}
                disabled={isSubmitting}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-md mt-sm">
          {errors.root?.serverError && (
            <p className="-mt-md text-sm text-error text-center">
              {errors.root.serverError.message}
            </p>
          )}
          <PrimaryButton type="submit" text="Continue" loading={isSubmitting} />
        </div>
      </form>
    </div>
  );
}
