import ForgotPasswordStatusView from "@/src/features/forgot-password/status/forgot-password-status-view";
import { notFound } from "next/navigation";

export default async function ForgotPasswordStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ verificationId: string }>;
}) {
  const { verificationId } = await searchParams;

  if (!verificationId) {
    notFound();
  }
  return <ForgotPasswordStatusView verificationId={verificationId} />;
}
