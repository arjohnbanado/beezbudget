"use client";

import PrimaryButton from "@/src/components/shared/PrimaryButton";
import SecondaryButton from "@/src/components/shared/SecondaryButton";
import SeparatorWithText from "@/src/components/shared/SeparatorWithText";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import Image from "next/image";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod/v4";
import googleLogo from "@/public/images/logos/google-logo-search-com.svg";
import facebookLogo from "@/public/images/logos/facebook-logo.svg";
import { getApiErrorMessage } from "@/src/utils/errors";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type FormFields = z.infer<typeof schema>;

const schema = z.object({
  email: z
    .email("Please enter a valid email address.")
    .max(320, "Email address is too long."),
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password is too long"),
});

export default function SigninForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    setError,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await axios.post("/api/v1/auth/login", data);

      router.push(`/dashboard`);
    } catch (error) {
      setError("root.serverError", {
        type: "server",
        message: getApiErrorMessage(error),
      });
    }
  };

  return (
    <div className="mt-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-md">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                id="signin-form-email-input"
                label="Email Address"
                variant="outlined"
                helperText={errors.email ? errors.email.message : ""}
                error={Boolean(errors.email)}
                disabled={isSubmitting}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                disabled={isSubmitting}
                fullWidth
                id="signin-form-password-input"
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                error={Boolean(errors.password)}
                helperText={errors.password ? errors.password.message : ""}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          onClick={() => setShowPassword((visible) => !visible)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-md mt-xl">
          {errors.root?.serverError && (
            <p className="-mt-md text-sm text-error text-center">
              {errors.root.serverError.message}
            </p>
          )}
          <PrimaryButton type="submit" text="Log In" loading={isSubmitting} />
          <Button
            href="/forgot-password"
            disabled={isSubmitting}
            type="button"
            variant="text"
            sx={{
              color: "var(--color-dark-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <span className="text-base">Forgot Password?</span>
          </Button>
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
        <SeparatorWithText color="#a3a3a3" text="" />
        <SecondaryButton
          type="button"
          text="Create new account"
          path="/signup"
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
}
