"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  SyntheticEvent,
  useEffect,
} from "react";
import {
  Snackbar,
  Alert,
  AlertColor,
  SnackbarCloseReason,
} from "@mui/material";

export interface ToastOptions {
  message?: string;
  severity?: AlertColor;
  content?: ReactNode;
  autoHideDuration?: number | null;
}

interface ToastMessage extends ToastOptions {
  key: number;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
  closeToast: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [snackPack, setSnackPack] = useState<readonly ToastMessage[]>([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState<ToastMessage | undefined>(
    undefined,
  );

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessageInfo({ ...snackPack[0] });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSnackPack((prev) => prev.slice(1));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const showToast = useCallback((options: ToastOptions) => {
    setSnackPack((prev) => [
      ...prev,
      { ...options, key: new Date().getTime() },
    ]);
  }, []);

  const handleClose = (
    _event: SyntheticEvent | Event | null,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const closeToast = useCallback(() => {
    setOpen(false);
  }, []);

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  const defaultDuration = 6000;
  const duration =
    messageInfo?.autoHideDuration !== undefined
      ? messageInfo.autoHideDuration
      : defaultDuration;
  const ariaRole =
    messageInfo?.severity === "error" || messageInfo?.severity === "warning"
      ? "alert"
      : "status";

  return (
    <ToastContext.Provider value={{ showToast, closeToast }}>
      {children}
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        slotProps={{ transition: { onExited: handleExited } }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {messageInfo?.content ? (
          <div>{messageInfo.content}</div>
        ) : messageInfo?.message ? (
          <Alert
            onClose={handleClose}
            severity={messageInfo.severity || "info"}
            variant="filled"
            sx={{ width: "100%" }}
            role={ariaRole}
          >
            {messageInfo.message}
          </Alert>
        ) : (
          <div />
        )}
      </Snackbar>
    </ToastContext.Provider>
  );
};
