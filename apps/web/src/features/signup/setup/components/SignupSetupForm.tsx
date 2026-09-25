"use client";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircle from "@mui/icons-material/CheckCircle";
import RadioButtonUnchecked from "@mui/icons-material/RadioButtonUnchecked";

import PrimaryButton from "@/src/components/shared/PrimaryButton";

import { IconButton, InputAdornment, TextField, Box } from "@mui/material";

import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";

import { z } from "zod/v4";
import { useState } from "react";
import axios from "axios";
import { getApiErrorMessage } from "@/src/utils/errors";
import { useRouter } from "next/navigation";

const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters long")
  .max(128, "Password cannot exceed 128 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^a-zA-Z0-9]/,
    "Password must contain at least one special character",
  );

const schema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormFields = z.infer<typeof schema>;

// Password requirements for live checklist
const passwordRequirements = [
  {
    id: "min-length",
    label: "At least 12 characters",
    test: (password: string) => password.length >= 12,
  },
  {
    id: "max-length",
    label: "No more than 128 characters",
    test: (password: string) => password.length <= 128,
  },
  {
    id: "lowercase",
    label: "At least one lowercase letter",
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    id: "uppercase",
    label: "At least one uppercase letter",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    id: "number",
    label: "At least one number",
    test: (password: string) => /[0-9]/.test(password),
  },
  {
    id: "special-character",
    label: "At least one special character",
    test: (password: string) => /[^a-zA-Z0-9]/.test(password),
  },
];

export default function SignupSetupForm({ rawToken }: { rawToken: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();

  const password = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { password } = data;
    try {
      const response = await axios.post("/api/v1/auth/register", {
        password,
        rawToken,
      });

      router.push(`/signup/setup/status?verificationId=${response.data.id}`);
    } catch (error) {
      setError("root.serverError", {
        type: "server",
        message: getApiErrorMessage(error),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-md mt-sm"
    >
      {/* Password */}
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            disabled={isSubmitting}
            fullWidth
            id="signup-setup-password-input"
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            error={Boolean(errors.password)}
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

      {/* Password Requirements Checklist */}
      <Box className="flex flex-col gap-xs">
        <p className="text-sm">Password must contain:</p>

        <Box className="flex flex-col gap-1">
          {passwordRequirements.map((requirement) => {
            const passed = requirement.test(password);

            return (
              <Box key={requirement.id} className="flex items-center gap-xs">
                {passed ? (
                  <CheckCircle className="text-sm text-success" />
                ) : (
                  <RadioButtonUnchecked className="text-sm text-dark-subtle" />
                )}

                <p
                  className={`text-xs transition-colors duration-150 ease-in-out ${passed ? `text-success` : `text-dark-subtle`}`}
                >
                  {requirement.label}
                </p>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Confirm Password */}
      <Controller
        name="confirmPassword"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            disabled={isSubmitting}
            fullWidth
            id="signup-setup-confirm-password-input"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            variant="outlined"
            helperText={errors.confirmPassword?.message ?? ""}
            error={Boolean(errors.confirmPassword)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      onClick={() =>
                        setShowConfirmPassword((visible) => !visible)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
      />
      {/* Submit */}
      <div className="mt-md">
        <PrimaryButton
          type="submit"
          text="Complete Registration"
          loading={isSubmitting}
        />
      </div>
      {errors.root?.serverError && (
        <p className="text-sm text-error text-center">
          {errors.root.serverError.message}
        </p>
      )}
    </form>
  );
}
