"use client";

import { useEffect, useMemo, useState } from "react";
import { accountIcons } from "@/src/utils/account-icons";
import { TextField } from "@mui/material";
import FilteredAccountIcons from "./FilteredAccountIcons";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";

export default function AccountIconSearch({
  onCloseIconOptions,
}: {
  onCloseIconOptions: () => void;
}) {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);

    return () => clearTimeout(handler);
  }, [query]);

  const filteredIcons = useMemo(() => {
    return accountIcons.filter((accountIcon) => {
      return (
        accountIcon.keywords.some((keyword) =>
          keyword.includes(debouncedQuery.toLocaleLowerCase()),
        ) ||
        accountIcon.name
          .toLocaleLowerCase()
          .includes(debouncedQuery.toLocaleLowerCase())
      );
    });
  }, [debouncedQuery]);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-lg flex flex-col gap-sm">
        <h1 className="text-lg font-bold text-center">Choose account icon</h1>
        <TextField
          autoFocus
          id="search-icon-input"
          label="Search icon..."
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
        {filteredIcons.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-dark-subtle gap-sm text-center">
            {query.length !== 0 && (
              <>
                <SearchOffOutlinedIcon sx={{ fontSize: 48, opacity: 0.5 }} />
                <p className="text-sm text-center line-clamp-3 break-all px-sm">
                  No icon found for &quot;{query}&quot;
                </p>
              </>
            )}
          </div>
        ) : (
          <FilteredAccountIcons
            accountIcons={filteredIcons}
            onCloseIconOptions={onCloseIconOptions}
          />
        )}
      </div>
    </div>
  );
}
