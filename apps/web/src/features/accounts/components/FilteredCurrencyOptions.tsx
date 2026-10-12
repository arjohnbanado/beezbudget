"use client";

import { memo, useState } from "react";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";
import Image from "next/image";
import { CurrencyType } from "./CurrencyOptions";
import { List, ListItemButton, Radio } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { FormFields } from "./NewAccountForm";

const CurrencyOptionLabel = ({ currency }: { currency: CurrencyType }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex justify-between items-center gap-md text-xs">
      <div className="relative flex items-center justify-center w-[24px] h-[24px]">
        {imageError ? (
          <span className="text-dark-subtle">
            <BrokenImageOutlinedIcon fontSize="medium" color="inherit" />
          </span>
        ) : (
          <Image
            fill
            className="object-contain"
            src={`/images/utils/flags/${currency.code}.svg`}
            alt={`${currency.name} flag`}
            onError={() => setImageError(true)}
            loading="lazy"
            quality={10}
          />
        )}
      </div>
      <div>
        <span>{currency.name}</span>
        <span className="font-bold ml-xs">({currency.code})</span>
      </div>
    </div>
  );
};
function FilteredCurrencyOptions({
  currencies,
  onCloseCurrencyOptions,
}: {
  currencies: CurrencyType[];
  onCloseCurrencyOptions: () => void;
}) {
  const { setValue, watch } = useFormContext<FormFields>();
  const selectedCurrency = watch("currency_code");

  return (
    <List disablePadding>
      {currencies.map((currency) => {
        const isSelected = selectedCurrency === currency.code;
        return (
          <ListItemButton
            key={currency.code}
            selected={isSelected}
            onClick={() => {
              setValue("currency_code", currency.code, { shouldValidate: true });
              onCloseCurrencyOptions();
            }}
            sx={{
              width: "100%",
              padding: "var(--spacing-xs) 0",
              justifyContent: "space-between",
              borderBottom: "2px solid var(--color-canvas)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "var(--color-brand-subtle)",
              },
            }}
          >
            <CurrencyOptionLabel currency={currency} />
            <Radio
              checked={isSelected}
              size="small"
              tabIndex={-1}
              disableRipple
            />
          </ListItemButton>
        );
      })}
    </List>
  );
}

export default memo(FilteredCurrencyOptions);
