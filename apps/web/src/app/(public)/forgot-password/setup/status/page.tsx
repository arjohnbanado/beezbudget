import ForgotPasswordSetupStatusView from "@/src/features/forgot-password/setup/status/forgot-password-setup-status-view";
import { notFound } from "next/navigation";

export default async function ForgotPasswordSetupStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ verificationId: string }>;
}) {
  const { verificationId } = await searchParams;

  if (!verificationId) {
    return notFound();
  }
  return <ForgotPasswordSetupStatusView verificationId={verificationId} />;
}
