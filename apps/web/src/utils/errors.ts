import { ApiErrorResponse } from "@/src/types/error.types";
import axios from "axios";

/**
 * Safely extracts the error message from an unknown backend API error response payload.
 * Fallbacks to a universal message if the detail string is missing or malformed.
 */
export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = "An unexpected error occurred.",
): string {
  // 1. Handle explicit backend error details returned via Axios
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string" && detail.trim() !== "") {
      return detail;
    }
  }

  // 2. Fallback check for standard JavaScript Errors (e.g., runtime bugs, native network drops)
  // if (error instanceof Error) {
  //   return error.message;
  // }

  // 3. Fallback for strings, null, or undefined objects thrown wildly
  return fallbackMessage;
}
