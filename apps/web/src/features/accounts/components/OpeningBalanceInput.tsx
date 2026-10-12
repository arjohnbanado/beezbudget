"use client";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { FormFields } from "./NewAccountForm";
import {
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import { useState } from "react";
import Image from "next/image";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";

const CurrencyFlag = ({ currencyCode }: { currencyCode: string }) => {
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
};

export default function OpeningBalanceInput({
  onOpenCurrencies,
}: {
  onOpenCurrencies: () => void;
}) {
  const {
    control,
    formState: { isSubmitting },
  } = useFormContext<FormFields>();

  const openingBalanceSign = useWatch({
    control,
    name: "opening_balance_sign",
  });
  const currencyCode = useWatch({
    control,
    name: "currency_code",
  });
  const openingBalance = useWatch({
    control,
    name: "opening_balance",
  });

  const isBalanceZeroOrEmpty =
    !openingBalance || openingBalance === "" || parseFloat(openingBalance) === 0;

  return (
    <div>
      <div>
        <Controller
          control={control}
          name="opening_balance"
          render={({ field, fieldState }) => (
            <NumericFormat
              value={field.value}
              customInput={TextField}
              label="Opening Balance (optional)"
              fullWidth
              id="opening-balance-form-input"
              variant="outlined"
              helperText={fieldState.error?.message}
              error={Boolean(fieldState.error)}
              disabled={isSubmitting}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
                htmlInput: { inputMode: "decimal" },
                input: {
                  startAdornment: openingBalanceSign === "negative" && (
                    <span className="pr-xs text-3xl">-</span>
                  ),
                  endAdornment: (
                    <Button
                      type="button"
                      onClick={onOpenCurrencies}
                      disabled={isSubmitting}
                    >
                      <div className="p-xs flex items-center gap-xs">
                        <CurrencyFlag
                          key={currencyCode}
                          currencyCode={currencyCode}
                        />
                        <span>{currencyCode}</span>
                      </div>
                    </Button>
                  ),
                },
              }}
              onValueChange={({ value }) => field.onChange(value)}
              onBlur={field.onBlur}
              onFocus={(event) => {
                event.target.select();
              }}
              allowNegative={false}
              allowedDecimalSeparators={[","]}
              decimalScale={2}
              fixedDecimalScale
              getInputRef={field.ref}
              valueIsNumericString
            />
          )}
        />
      </div>
      <div className="mt-xs">
        <Controller
          control={control}
          name="opening_balance_sign"
          render={({ field }) => (
            <ToggleButtonGroup
              {...field}
              color="primary"
              exclusive
              disabled={isSubmitting || isBalanceZeroOrEmpty}
              aria-label="opening-balance-sign"
            >
              <ToggleButton value="negative" className="text-xs normal-case">
                Negative
              </ToggleButton>
              <ToggleButton value="positive" className="text-xs normal-case">
                Positive
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        />
      </div>
    </div>
  );
}
