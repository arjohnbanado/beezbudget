import GuideView from "@/src/components/ui/GuideView";
import BeezLogo, { BeezLogoSize } from "@/src/components/shared/BeezLogo";
import PrimaryButton from "@/src/components/shared/PrimaryButton";
import SecondaryButton from "@/src/components/shared/SecondaryButton";
import { notFound } from "next/navigation";
import ResendTimer from "./components/ResendTimer";

interface VerificationResponse {
  email: string;
  resendAvailableAt: string;
}

export default async function ForgotPasswordStatusView({
  verificationId,
}: {
  verificationId: string;
}) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";

  const data = await fetch(
    `${backendUrl}/api/v1/auth/forgot-password/${verificationId}`,
  );

  if (!data.ok) {
    notFound();
  }

  const verification = (await data.json()) as VerificationResponse;

  return (
    <div>
      <GuideView>
        <div className="flex items-center justify-center">
          <BeezLogo size={BeezLogoSize.EXTRASMALL} />
        </div>
        <div className="flex flex-col gap-xs border-2 border-subtle px-sm py-lg rounded-lg max-md:mt-xl md:border-none md:p-none md:mt-md">
          <h1 className="text-xl font-bold">Help Is on the Way!</h1>
          <p className="text-base">
            Don't worry, we've got you covered! A password reset link is on its
            way to{" "}
            <span className="text-brand-default font-bold">
              {verification.email}
            </span>
            . Open the email to set a new password and get back on track. If you
            don't see it shortly, check your spam or promotions tab.
          </p>
          <div className="mt-sm">
            <ResendTimer
              verificationId={verificationId}
              resendAvailableAt={verification.resendAvailableAt}
            />
          </div>
        </div>
        <div className="flex flex-col gap-md mt-sm">
          <PrimaryButton type="button" text="Go to Log in" path="/signin" />
          <SecondaryButton
            type="button"
            text="Change email address?"
            path="/forgot-password"
          />
        </div>
      </GuideView>
    </div>
  );
}
