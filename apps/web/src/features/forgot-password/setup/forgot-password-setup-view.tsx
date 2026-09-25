import GuideView from "@/src/components/ui/GuideView";
import Image from "next/image";
import bbfpsetupheaderbanner from "@/public/images/illustrations/beez-with-help-mode-account-recovery.svg";
import { notFound } from "next/navigation";
import ForgotPasswordSetupForm from "./components/ForgotPasswordSetupForm";

export default async function ForgotPasswordSetupView({
  rawToken,
  verificationId,
}: {
  rawToken: string;
  verificationId: string;
}) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";

  const data = await fetch(
    `${backendUrl}/api/v1/auth/forgot-password/${verificationId}`,
  );

  if (!data.ok) {
    notFound();
  }

  return (
    <div>
      <GuideView>
        <div className="-mx-lg -mt-lg sm:-mx-xl sm:-mt-xl">
          <Image
            src={bbfpsetupheaderbanner}
            alt="BeezBudget security theme header banner for forgot password setup form"
            className="object-cover md:rounded-tr-lg md:rounded-tl-lg"
          />
        </div>
        <div className="flex flex-col gap-xs mt-xl">
          <h1 className="text-xl font-bold">Reset Your Password</h1>
          <p className="text-base">
            Create a new, secure password to protect your BeezBudget account.
          </p>
        </div>
        <ForgotPasswordSetupForm rawToken={rawToken} />
      </GuideView>
    </div>
  );
}
