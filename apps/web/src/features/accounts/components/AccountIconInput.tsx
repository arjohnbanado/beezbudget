"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { FormFields } from "./NewAccountForm";
import { Backdrop, TextField } from "@mui/material";
import { useState } from "react";
import { getAccountIconByKey } from "@/src/utils/account-icons";
import BackDropView from "@/src/components/ui/BackDropView";
import AccountIconSearch from "./AccountIconSearch";
import AccountIconView from "@/src/components/shared/AccountIconView";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";
export default function AccountIconInput() {
  const [openIconOptions, setOpenIconOptions] = useState(false);
  const {
    control,
    formState: { isSubmitting, errors },
  } = useFormContext<FormFields>();

  const handleCloseIconOptions = () => {
    setOpenIconOptions(false);
  };
  const handleOpenIconOptions = () => {
    setOpenIconOptions(true);
  };

  const iconKey = useWatch({ control, name: "icon_key" });
  const selectedIcon = getAccountIconByKey(iconKey);

  return (
    <div>
      <div>
        <TextField
          value={selectedIcon?.name || "Unknown"}
          label="Icon"
          fullWidth
          id="icon-form-input"
          variant="outlined"
          helperText={errors.icon_key?.message}
          error={Boolean(errors.icon_key)}
          disabled={isSubmitting}
          onClick={handleOpenIconOptions}
          sx={{
            "& .MuiInputBase-input": {
              cursor: "pointer",
            },
          }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
            input: {
              readOnly: true,
              endAdornment: (
                <div className="flex items-center gap-xs cursor-pointer">
                  <AccountIconView>
                    {selectedIcon?.icon ? (
                      <selectedIcon.icon size={24} className="text-light" />
                    ) : (
                      <BrokenImageOutlinedIcon
                        fontSize="small"
                        className="text-light"
                      />
                    )}
                  </AccountIconView>
                </div>
              ),
            },
          }}
        />
      </div>
      {openIconOptions && (
        <Backdrop
          sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}
          open={openIconOptions}
          onClick={handleCloseIconOptions}
        >
          <BackDropView>
            <AccountIconSearch onCloseIconOptions={handleCloseIconOptions} />
          </BackDropView>
        </Backdrop>
      )}
    </div>
  );
}
