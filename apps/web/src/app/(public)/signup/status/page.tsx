import SignupStatusView from "@/src/features/signup/status/signup-status-view";
import { notFound } from "next/navigation";

export default async function SignupStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ verificationId: string }>;
}) {
  const { verificationId } = await searchParams;

  if (!verificationId) {
    notFound();
  }

  return <SignupStatusView verificationId={verificationId} />;
}
