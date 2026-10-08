"use client";

import { RadioGroup, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormFields } from "./NewAccountForm";
import { CurrencyType } from "./CurrencyOptions";
import FilteredCurrencyOptions from "./FilteredCurrencyOptions";

export default function CurrencySearch({
  currencies,
  onCloseCurrencyOptions,
}: {
  currencies: CurrencyType[];
  onCloseCurrencyOptions: () => void;
}) {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const { control } = useFormContext<FormFields>();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);

    return () => clearTimeout(handler);
  }, [query]);

  const filteredCurrencies = useMemo(() => {
    return currencies.filter((currency) => {
      return (
        currency.code
          .toLocaleLowerCase()
          .includes(debouncedQuery.toLocaleLowerCase()) ||
        currency.name
          .toLocaleLowerCase()
          .includes(debouncedQuery.toLocaleLowerCase())
      );
    });
  }, [debouncedQuery]);

  return (
    <div>
      <div>
        <TextField
          id="search-input"
          label="Search"
          value={query}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(event.target.value);
          }}
          fullWidth
          variant="outlined"
          color="primary"
        />
      </div>
      <div className="grow overflow-y-auto">
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
              <FilteredCurrencyOptions
                currencies={filteredCurrencies}
                onCloseCurrencyOptions={onCloseCurrencyOptions}
              />
            </RadioGroup>
          )}
        />
      </div>
    </div>
  );
}
