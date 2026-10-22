import Image from "next/image";
import GuideView from "@/src/components/ui/GuideView";
import bbonboardingheaderbanner from "@/public/images/illustrations/beez-welcoming-mood.svg";
import OnboardingForm from "./components/OnboardingForm";

export default function OnboardingView() {
  return (
    <div>
      <GuideView>
        <div className="-mx-lg -mt-lg sm:-mx-xl sm:-mt-xl">
          <Image
            src={bbonboardingheaderbanner}
            alt="BeezBudget welcoming theme header banner for onboarding"
            className="object-cover md:rounded-tr-lg md:rounded-tl-lg"
          />
        </div>
        <div className="flex flex-col gap-xs mt-xl">
          <h1 className="text-xl font-bold">Welcome to BeezBudget!</h1>
          <p className="text-base">
            Let&apos;s personalize your experience. Tell us your name and select
            your preferred currency to get started.
          </p>
        </div>
        <OnboardingForm />
      </GuideView>
    </div>
  );
}
