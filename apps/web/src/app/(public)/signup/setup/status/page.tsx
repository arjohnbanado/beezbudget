import SignupSetupStatusView from "@/src/features/signup/setup/status/signup-setup-status-view";
import { notFound } from "next/navigation";

export default async function SignupSetupStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ verificationId: string }>;
}) {
  const { verificationId } = await searchParams;

  if (!verificationId) {
    return notFound();
  }
  return <SignupSetupStatusView verificationId={verificationId} />;
}
