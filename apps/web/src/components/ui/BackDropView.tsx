"use client";

import { Dialog } from "@mui/material";

interface BackDropViewProps {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  isHeightContents?: boolean;
}

export default function BackDropView({
  open,
  onClose,
  children,
  isHeightContents = false,
}: BackDropViewProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      slotProps={{
        paper: {
          className:
            "overflow-y-auto rounded-lg w-[90%] bg-light p-lg md:w-[70%] lg:w-[50%] xl:w-[30%] m-0",
          style: isHeightContents ? { maxHeight: "80%" } : { height: "80%" },
        },
      }}
    >
      {children}
    </Dialog>
  );
}
