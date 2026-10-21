"use client";

import { Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import BackDropView from "@/src/components/ui/BackDropView";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@/src/lib/api-client";
import { getApiErrorMessage } from "@/src/utils/errors";
import PrimaryButton from "@/src/components/shared/PrimaryButton";
import { useToast } from "@/src/providers/ToastProvider";
import { useSWRConfig } from "swr";

const schema = z.object({
  account_type: z
    .string()
    .min(1, "Account type name is required.")
    .max(100, "Account type name must be 100 characters or fewer."),
});

type FormFields = z.infer<typeof schema>;

export default function AddNewAccountType() {
  const [openNewType, setOpenNewType] = useState(false);
  const { showToast } = useToast();
  const { mutate } = useSWRConfig();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: { account_type: "" },
  });

  const handleCloseNewType = () => {
    setOpenNewType(false);
    reset();
  };

  const handleOpenNewType = () => {
    setOpenNewType(true);
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await apiClient.post("/api/v1/accounts/types", data);
      mutate("/api/v1/accounts/types");
      showToast({
        message: "Account type saved successfully.",
        severity: "success",
      });
      handleCloseNewType();
    } catch (error) {
      setError("root.serverError", {
        type: "server",
        message: getApiErrorMessage(error),
      });
    }
  };

  return (
    <div>
      <Button type="button" onClick={handleOpenNewType}>
        <div className="flex justify-between items-center">
          <span>
            <AddIcon sx={{ width: "1.25rem" }} />
          </span>
          <span>Add New</span>
        </div>
      </Button>

      <BackDropView
        open={openNewType}
        onClose={handleCloseNewType}
        isHeightContents={true}
      >
          <div>
            <div className="mb-xl">
              <h1 className="text-lg font-bold text-center">
                Add new account type
              </h1>
            </div>

            <div className="flex flex-col">
              <Controller
                control={control}
                name="account_type"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    fullWidth
                    id="add-new-account-type-name-input"
                    variant="outlined"
                    helperText={
                      errors.account_type ? errors.account_type.message : " "
                    }
                    error={Boolean(errors.account_type)}
                    disabled={isSubmitting}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                )}
              />

              {errors.root?.serverError && (
                <p className="-mt-md text-sm text-error text-center">
                  {errors.root.serverError.message}
                </p>
              )}

              <div className="mt-sm">
                <PrimaryButton
                  type="button"
                  text="Save"
                  onClick={handleSubmit(onSubmit)}
                  loading={isSubmitting}
                />
              </div>
            </div>
          </div>
        </BackDropView>
    </div>
  );
}
