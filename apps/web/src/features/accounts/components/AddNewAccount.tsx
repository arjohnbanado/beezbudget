"use client";

import SecondaryButton from "@/src/components/shared/SecondaryButton";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Backdrop, Button } from "@mui/material";
import { useState } from "react";
import NewAccountForm from "./NewAccountForm";
import BackDropView from "@/src/components/ui/BackDropView";
import { CloseOutlined } from "@mui/icons-material";

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
      >
        <BackDropView>
          <div className="absolute top-[6%] left-[5%] text-light">
            <Button
              type="button"
              variant="text"
              onClick={handleClose}
              color="inherit"
            >
              <span>
                <CloseOutlined />
              </span>
            </Button>
          </div>
          <NewAccountForm onSuccess={handleClose} />
        </BackDropView>
      </Backdrop>
    </div>
  );
}
