import { Button } from "@mui/material";
import React from "react";

interface ResendLinkProps {
  children: React.ReactNode;
  resendAvailableAt: Date;
}

export default function ResendLink({ children }: ResendLinkProps) {
  return (
    <Button>
      <div>
        <span>Resend link in </span>
      </div>
    </Button>
  );
}
