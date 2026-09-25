import ForgotPasswordSetupView from "@/src/features/forgot-password/setup/forgot-password-setup-view";
import { notFound } from "next/navigation";

export default async function ForgotPasswordSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ t: string; verificationId: string }>;
}) {
  let rawToken;

  const { t, verificationId } = await searchParams;

  rawToken = t;

  if (!rawToken || !verificationId) {
    notFound();
  }
  return (
    <ForgotPasswordSetupView
      rawToken={rawToken}
      verificationId={verificationId}
    />
  );
}
