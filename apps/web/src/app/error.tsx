"use client";

import { useEffect } from "react";
import ErrorView from "@/src/components/ui/ErrorView";
import somethingWentWrongBeez from "@/public/images/illustrations/beez-something-went-wrong-sad-mood.svg";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorView
      illustration={somethingWentWrongBeez}
      illustrationAlt="Sad Beez illustration for an unexpected error"
      retry={reset}
    />
  );
}
