"use client";

import { useEffect } from "react";
import { inter, madimiOne } from "@/src/lib/fonts";
import ErrorView from "@/src/components/ui/ErrorView";
import criticalErrorBeez from "@/public/images/illustrations/beez-critical-system-error-sad-mood.svg";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/src/styles/theme";
import "./globals.css";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className={`${madimiOne.variable} ${inter.variable}`}>
      <body className="text-dark font-sans">
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <ErrorView
              illustration={criticalErrorBeez}
              illustrationAlt="Sad Beez illustration for a critical system error"
              title="A critical error occurred"
              description="BeezBudget could not recover this page. Please try again or return to the home page."
              retry={retry}
            />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
