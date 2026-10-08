"use client";

import {
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import axios from "axios";
import { Controller, useFormContext } from "react-hook-form";
import useSWRImmutable from "swr/immutable";
import { FormFields } from "./NewAccountForm";
import Image from "next/image";
import { useState } from "react";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";
import SecondaryButton from "@/src/components/shared/SecondaryButton";
import CurrencySearch from "./CurrencySearch";

export interface CurrencyType {
  code: string;
  name: string;
  symbol: string;
}

const fetcher = (url: string) =>
  axios
    .get<CurrencyType[]>(url, { withCredentials: true, timeout: 10000 })
    .then((res) => res.data);

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

export default function CurrencyOptions({
  onCloseCurrencyOptions,
}: {
  onCloseCurrencyOptions: () => void;
}) {
  const { control } = useFormContext<FormFields>();
  const { data, error, isLoading, mutate } = useSWRImmutable<CurrencyType[]>(
    "/api/v1/currencies",
    fetcher,
    { shouldRetryOnError: false },
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <CircularProgress aria-label="Loading…" />
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-md">
        <p className="text-base font-medium">Failed to load currencies.</p>
        <p className="text-sm text-dark-subtle mt-xs mb-md">
          Please try again later.
        </p>
        <div className="w-max">
          <SecondaryButton
            type="button"
            text="Try again"
            textClassName="text-sm font-medium py-xs px-md"
            onClick={() => mutate()}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full">
      <div className="mb-xl">
        <h1 className="text-lg font-bold text-center">
          Choose account currency
        </h1>
      </div>
      <CurrencySearch
        currencies={data}
        onCloseCurrencyOptions={onCloseCurrencyOptions}
      />
      {/* <div className="grow overflow-y-auto">
        <Controller
          control={control}
          name="currency_code"
          render={({ field }) => (
            <RadioGroup
              {...field}
              aria-labelledby="currency-options"
              name="currency-options-radio-group"
              sx={{
                flexWrap: "nowrap",
              }}
            >
              {data?.map((currency) => {
                return (
                  <FormControlLabel
                    key={currency.code}
                    value={currency.code}
                    control={<Radio size="small" />}
                    label={<CurrencyOptionLabel currency={currency} />}
                    labelPlacement="start"
                    sx={{
                      width: "100%",
                      padding: "var(--spacing-xs)",
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
            </RadioGroup>
          )}
        />
      </div> */}
    </div>
  );
}
