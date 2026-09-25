import GuideView from "@/src/components/ui/GuideView";
import SignupSetupForm from "./components/SignupSetupForm";
import Image from "next/image";
import bbsetupheaderbanner from "@/public/images/illustrations/beez-with-security-things.svg";
import { notFound } from "next/navigation";

export default async function SignupSetupView({
  rawToken,
  verificationId,
}: {
  rawToken: string;
  verificationId: string;
}) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";

  const data = await fetch(
    `${backendUrl}/api/v1/auth/verifications/${verificationId}`,
  );

  if (!data.ok) {
    notFound();
  }

  return (
    <div>
      <GuideView>
        <div className="-mx-lg -mt-lg sm:-mx-xl sm:-mt-xl">
          <Image
            src={bbsetupheaderbanner}
            alt="BeezBudget security theme header banner for credentials setup form"
            className="object-cover md:rounded-tr-lg md:rounded-tl-lg"
          />
        </div>
        <div className="flex flex-col gap-xs mt-xl">
          <h1 className="text-xl font-bold">Set Your Password</h1>
          <p className="text-base">
            Create a secure password to protect your BeezBudget account.
          </p>
        </div>
        <SignupSetupForm rawToken={rawToken} />
      </GuideView>
    </div>
  );
}
