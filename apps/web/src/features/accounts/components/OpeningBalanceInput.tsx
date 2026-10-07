import { Controller, useFormContext } from "react-hook-form";
import { FormFields } from "./NewAccountForm";
import { TextField } from "@mui/material";
import { NumericFormat } from "react-number-format";

export default function OpeningBalanceInput() {
  const {
    control,
    formState: { isSubmitting },
  } = useFormContext<FormFields>();
  return (
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
                startAdornment: <span className="pr-xs text-3xl">-</span>,
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
  );
}
