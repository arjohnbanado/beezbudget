import PrimaryButton from "@/src/components/shared/PrimaryButton";
import GuideView from "@/src/components/ui/GuideView";
import Image from "next/image";
import bbfpsetupstatusheaderbanner from "@/public/images/illustrations/beez-being-assuring-after-account-recovery.svg";
import { notFound } from "next/navigation";

export default async function ForgotPasswordSetupStatusView({
  verificationId,
}: {
  verificationId: string;
}) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";

  const data = await fetch(
    `${backendUrl}/api/v1/auth/forgot-password/${verificationId}?status=used`,
  );

  if (!data.ok) {
    notFound();
  }

  return (
    <div>
      <GuideView>
        <div className="-mx-lg -mt-lg sm:-mx-xl sm:-mt-xl">
          <Image
            src={bbfpsetupstatusheaderbanner}
            alt="BeezBudget assuring theme header banner for successful forgot password setup"
            className="object-cover md:rounded-tr-lg md:rounded-tl-lg"
          />
        </div>
        <div className="flex flex-col gap-xs border-2 border-subtle px-sm py-lg rounded-lg max-md:mt-xl md:border-none md:p-none md:mt-md">
          <h1 className="text-xl font-bold">You’re Good to Go!</h1>
          <p className="text-base">
            Your password reset is complete. Head back to the login screen to
            sign in with your new password and manage your money.
          </p>
        </div>
        <div className="flex flex-col gap-md mt-sm">
          <PrimaryButton
            type="button"
            text="Log In to Continue"
            path="/signin"
          />
        </div>
      </GuideView>
    </div>
  );
}
