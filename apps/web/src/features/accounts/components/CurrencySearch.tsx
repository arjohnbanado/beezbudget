"use client";

import { TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { CurrencyType } from "./CurrencyOptions";
import FilteredCurrencyOptions from "./FilteredCurrencyOptions";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";

export default function CurrencySearch({
  currencies,
  onCloseCurrencyOptions,
}: {
  currencies: CurrencyType[];
  onCloseCurrencyOptions: () => void;
}) {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

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
  }, [debouncedQuery, currencies]);

  return (
    <div className="grow min-h-0 flex flex-col">
      <div className="mb-lg">
        <TextField
          autoFocus
          id="search-input"
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
          <FilteredCurrencyOptions
            currencies={filteredCurrencies}
            onCloseCurrencyOptions={onCloseCurrencyOptions}
          />
        )}
      </div>
    </div>
  );
}
