"use client";

import { useState } from "react";
import Image from "next/image";
import { InputAdornment, TextField } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";
import { useFormContext, useWatch } from "react-hook-form";
import type { OnboardingFormFields } from "./OnboardingForm";

function CurrencyFlag({ currencyCode }: { currencyCode: string }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative flex items-center justify-center w-[24px] h-[24px]">
      {imageError ? (
        <span className="text-dark-subtle">
          <BrokenImageOutlinedIcon fontSize="medium" color="inherit" />
        </span>
      ) : (
        <Image
          fill
          className="object-contain"
          src={`/images/utils/flags/${currencyCode}.svg`}
          alt={`${currencyCode} flag`}
          onError={() => setImageError(true)}
          loading="lazy"
          quality={10}
        />
      )}
    </div>
  );
}

export default function PreferredCurrencyInput({
  onOpenCurrencies,
}: {
  onOpenCurrencies: () => void;
}) {
  const {
    control,
    formState: { isSubmitting, errors },
  } = useFormContext<OnboardingFormFields>();

  const currencyCode = useWatch({
    control,
    name: "preferred_currency_code",
  });

  return (
    <TextField
      disabled={isSubmitting}
      fullWidth
      id="onboarding-form-currency-input"
      label="Preferred Currency"
      variant="outlined"
      value={currencyCode}
      onClick={onOpenCurrencies}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          onOpenCurrencies();
        }
      }}
      helperText={
        errors.preferred_currency_code
          ? errors.preferred_currency_code.message
          : ""
      }
      error={Boolean(errors.preferred_currency_code)}
      slotProps={{
        inputLabel: {
          shrink: true,
        },
        input: {
          readOnly: true,
          startAdornment: currencyCode ? (
            <InputAdornment position="start">
              <CurrencyFlag key={currencyCode} currencyCode={currencyCode} />
            </InputAdornment>
          ) : undefined,
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
  );
}
