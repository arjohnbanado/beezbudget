"use client";

import SecondaryButton from "@/src/components/shared/SecondaryButton";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Backdrop, Button } from "@mui/material";
import { useState } from "react";

export default function AddNewAccount() {
  const [openAccountForm, setOpenAccountForm] = useState(false);
  const handleClose = () => {
    setOpenAccountForm(false);
  };
  const handleOpenAccountForm = () => {
    setOpenAccountForm(true);
  };

  return (
    <div>
      <div className="w-max">
        <SecondaryButton
          onClick={handleOpenAccountForm}
          text="Add new account"
          icon={AddOutlinedIcon}
          type="button"
          iconPosition="left"
          textClassName="p-none"
        />
      </div>
      <Backdrop
        sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}
        open={openAccountForm}
        onClick={handleClose}
      >
        <div
          className="overflow-y-auto rounded-lg w-[90%] h-[80%] bg-light p-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <h1 className="text-lg font-bold">Create new account</h1>
            <Button></Button>
          </div>
        </div>
      </Backdrop>
    </div>
  );
}
