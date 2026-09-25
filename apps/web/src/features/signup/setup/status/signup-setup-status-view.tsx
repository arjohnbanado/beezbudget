import PrimaryButton from "@/src/components/shared/PrimaryButton";
import GuideView from "@/src/components/ui/GuideView";
import Image from "next/image";
import bbsetupstatusheaderbanner from "@/public/images/illustrations/beez-welcoming-mood.svg";
import { notFound } from "next/navigation";

export default async function SignupSetupStatusView({
  verificationId,
}: {
  verificationId: string;
}) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";

  const data = await fetch(
    `${backendUrl}/api/v1/auth/verifications/${verificationId}?status=used`,
  );

  if (!data.ok) {
    notFound();
  }

  return (
    <div>
      <GuideView>
        <div className="-mx-lg -mt-lg sm:-mx-xl sm:-mt-xl">
          <Image
            src={bbsetupstatusheaderbanner}
            alt="BeezBudget welcoming theme header banner for successful credentials setup"
            className="object-cover md:rounded-tr-lg md:rounded-tl-lg"
          />
        </div>
        <div className="flex flex-col gap-xs border-2 border-subtle px-sm py-lg rounded-lg max-md:mt-xl md:border-none md:p-none md:mt-md">
          <h1 className="text-xl font-bold">A Sweeter Journey Begins!</h1>
          <p className="text-base">
            Your account is officially ready! Log in now to track your daily
            spending, organize your budgets, and start sweetening your savings.
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
