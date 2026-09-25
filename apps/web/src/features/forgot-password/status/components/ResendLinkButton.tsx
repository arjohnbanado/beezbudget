"use client";

import { AsyncState } from "@/src/types/async.types";
import { getApiErrorMessage } from "@/src/utils/errors";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";

interface ResendLinkButtonProps {
  verificationId: string;
}

export default function ResendLinkButton({
  verificationId,
}: ResendLinkButtonProps) {
  const [state, setState] = useState<AsyncState>({ status: "idle" });

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleResendLink = async () => {
    setState({ status: "loading" });

    try {
      const response = await axios.post<{ id: string }>(
        `/api/v1/auth/forgot-password/${verificationId}/resends`,
        {
          id: verificationId,
        },
      );
      const params = new URLSearchParams(searchParams.toString());

      params.set("verificationId", response.data.id);

      router.push(`${pathname}?${params.toString()}`);
      setState({ status: "success" });
    } catch (error) {
      setState({ status: "error", message: getApiErrorMessage(error) });
    }
  };

  if (state.status === "loading") {
    return (
      <div className="px-lg">
        <CircularProgress size="1rem" aria-label="Loading…" />
      </div>
    );
  }

  if (state.status === "error") {
    return <span className="text-error text-base">{state.message}</span>;
  }

  return (
    <Button
      type="button"
      variant="text"
      color="info"
      sx={{ width: "max-content" }}
      onClick={handleResendLink}
    >
      <span className="text-link font-bold text-base">Resend link</span>
    </Button>
  );
}
