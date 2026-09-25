import SignupSetupView from "@/src/features/signup/setup/signup-setup-view";
import { notFound } from "next/navigation";

export default async function SignupSetupPage({
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
    <SignupSetupView rawToken={rawToken} verificationId={verificationId} />
  );
}
