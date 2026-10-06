"use client";

import { Button, SxProps, Theme } from "@mui/material";
import { useRouter } from "next/navigation";

export interface BackButtonProps {
  type?: "button" | "submit" | "reset";
  variant?: "text" | "outlined" | "contained";
  sx?: SxProps<Theme>;
  children: React.ReactNode;
}

export default function BackButton({
  type = "button",
  variant = "text",
  sx,
  children,
}: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      type={type}
      variant={variant}
      sx={sx}
      onClick={() => router.back()}
    >
      {children}
    </Button>
  );
}
