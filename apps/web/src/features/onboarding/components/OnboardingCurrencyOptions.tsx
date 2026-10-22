"use client";

import { memo, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  CircularProgress,
  List,
  ListItemButton,
  Radio,
  TextField,
} from "@mui/material";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import useSWRImmutable from "swr/immutable";
import { useFormContext } from "react-hook-form";
import { apiClient } from "@/src/lib/api-client";
import SecondaryButton from "@/src/components/shared/SecondaryButton";
import type { CurrencyType } from "@/src/features/accounts/components/CurrencyOptions";
import type { OnboardingFormFields } from "./OnboardingForm";

const fetcher = (url: string) =>
  apiClient
    .get<CurrencyType[]>(url, { timeout: 10000 })
    .then((res) => res.data);

function CurrencyOptionLabel({ currency }: { currency: CurrencyType }) {
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
}

const FilteredOnboardingCurrencyList = memo(
  function FilteredOnboardingCurrencyList({
    currencies,
    onCloseCurrencyOptions,
  }: {
    currencies: CurrencyType[];
    onCloseCurrencyOptions: () => void;
  }) {
    const { setValue, watch } = useFormContext<OnboardingFormFields>();
    const selectedCurrency = watch("preferred_currency_code");

    return (
      <List disablePadding>
        {currencies.map((currency) => {
          const isSelected = selectedCurrency === currency.code;
          return (
            <ListItemButton
              key={currency.code}
              selected={isSelected}
              onClick={() => {
                setValue("preferred_currency_code", currency.code, {
                  shouldValidate: true,
                });
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
  },
);

export default function OnboardingCurrencyOptions({
  onCloseCurrencyOptions,
}: {
  onCloseCurrencyOptions: () => void;
}) {
  const { data, error, isLoading, mutate } = useSWRImmutable<CurrencyType[]>(
    "/api/v1/currencies",
    fetcher,
    { shouldRetryOnError: false },
  );

  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);

    return () => clearTimeout(handler);
  }, [query]);

  const filteredCurrencies = useMemo(() => {
    if (!data) return [];
    return data.filter((currency) => {
      return (
        currency.code
          .toLocaleLowerCase()
          .includes(debouncedQuery.toLocaleLowerCase()) ||
        currency.name
          .toLocaleLowerCase()
          .includes(debouncedQuery.toLocaleLowerCase())
      );
    });
  }, [debouncedQuery, data]);

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
        <p className="text-base font-semibold">Failed to load currencies.</p>
        <p className="text-sm text-dark-subtle mt-xs mb-md">
          Please try again later.
        </p>
        <div className="w-max">
          <SecondaryButton
            type="button"
            text="Try again"
            textClassName="text-sm font-semibold py-xs px-md"
            onClick={() => mutate()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-sm">
        <h1 className="text-lg font-bold text-center">
          Choose preferred currency
        </h1>
      </div>
      <div className="grow min-h-0 flex flex-col">
        <div className="mb-lg">
          <TextField
            autoFocus
            id="onboarding-currency-search-input"
            label="Search currency..."
            value={query}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setQuery(event.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            fullWidth
            variant="outlined"
            color="primary"
          />
        </div>
        <div className="grow overflow-y-auto">
          {filteredCurrencies.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-dark-subtle gap-sm text-center">
              {query.length !== 0 && (
                <>
                  <SearchOffOutlinedIcon sx={{ fontSize: 48, opacity: 0.5 }} />
                  <p className="text-sm text-center line-clamp-3 break-all px-sm">
                    No currency found for &quot;{query}&quot;
                  </p>
                </>
              )}
            </div>
          ) : (
            <FilteredOnboardingCurrencyList
              currencies={filteredCurrencies}
              onCloseCurrencyOptions={onCloseCurrencyOptions}
            />
          )}
        </div>
      </div>
    </div>
  );
}
