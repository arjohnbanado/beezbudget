"use client";

import { memo, useState } from "react";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";
import Image from "next/image";
import { CurrencyType } from "./CurrencyOptions";
import { FormControlLabel, Radio } from "@mui/material";

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
  return (
    <>
      {currencies.map((currency) => {
        return (
          <FormControlLabel
            key={currency.code}
            value={currency.code}
            control={<Radio size="small" />}
            label={<CurrencyOptionLabel currency={currency} />}
            labelPlacement="start"
            sx={{
              width: "100%",
              padding: "var(--spacing-xs) 0",
              justifyContent: "space-between",
              margin: 0,
              borderBottom: "2px solid var(--color-canvas)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "var(--color-brand-subtle)",
                cursor: "pointer",
              },
            }}
            onChange={onCloseCurrencyOptions}
          />
        );
      })}
    </>
  );
}

export default memo(FilteredCurrencyOptions);
