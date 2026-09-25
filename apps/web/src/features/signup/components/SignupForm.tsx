"use client";

import PrimaryButton from "@/src/components/shared/PrimaryButton";
import SecondaryButton from "@/src/components/shared/SecondaryButton";
import SeparatorWithText from "@/src/components/shared/SeparatorWithText";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@mui/material";
import Image from "next/image";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod/v4";
import googleLogo from "@/public/images/logos/google-logo-search-com.svg";
import facebookLogo from "@/public/images/logos/facebook-logo.svg";
import { getApiErrorMessage } from "@/src/utils/errors";
import axios from "axios";
import { useRouter } from "next/navigation";

type FormFields = z.infer<typeof schema>;

const schema = z.object({
  email: z
    .email("Invalid email. Please enter a valid email address.")
    .min(5, "Email address must be at least 5 characters long")
    .max(320, "Email cannot exceed 320 characters"),
});

export default function SignupForm() {
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
        "/api/v1/auth/verifications",
        data,
      );

      router.push(`/signup/status?verificationId=${response.data.id}`);
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
                id="signup-form-email-input"
                label="Email Address"
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
          <SecondaryButton
            type="button"
            text="I have an existing account"
            path="/signin"
            disabled={isSubmitting}
          />
        </div>
        <SeparatorWithText color="#a3a3a3" />

        <div className="flex flex-col gap-sm">
          <Button
            type="button"
            href="/google"
            variant="outlined"
            fullWidth
            sx={{
              border: "2px solid var(--color-subtle)",
              color: "var(--color-dark-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              py: "var(--spacing-sm)",
            }}
            disabled={isSubmitting}
          >
            <Image
              src={googleLogo}
              alt=""
              width={24}
              height={24}
              className="absolute left-4"
            />

            <span>Continue with Google</span>
          </Button>
          <Button
            type="button"
            href="/facebook"
            variant="outlined"
            fullWidth
            sx={{
              border: "2px solid var(--color-subtle)",
              color: "var(--color-dark-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              py: "var(--spacing-sm)",
            }}
            disabled={isSubmitting}
          >
            <Image
              src={facebookLogo}
              alt=""
              width={24}
              height={24}
              className="absolute left-4"
            />

            <span>Continue with Facebook</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
