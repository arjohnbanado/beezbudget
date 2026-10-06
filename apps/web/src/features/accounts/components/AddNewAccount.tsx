"use client";

import SecondaryButton from "@/src/components/shared/SecondaryButton";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Backdrop } from "@mui/material";
import { useState } from "react";
import NewAccountForm from "./NewAccountForm";
import BackDropView from "@/src/components/ui/BackDropView";

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
        <BackDropView>
          <NewAccountForm />
        </BackDropView>
      </Backdrop>
    </div>
  );
}
