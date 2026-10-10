import Image from "next/image";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import bbsigninheaderbanner from "@/public/images/illustrations/beez-with-coin-and-piggy-bank.svg";
import SigninForm from "./components/SigninForm";
import SigninBanner from "./components/SigninBanner";
import BackButton from "@/src/components/shared/BackButton";
export default function SigninView() {
  return (
    <div className="min-h-screen md:bg-canvas md:flex md:items-center md:justify-center">
      <div className="h-max md:bg-light md:w-[90%] lg:w-[70%] xl:w-[60%] md:rounded-lg md:my-xl md:flex">
        <SigninBanner />

        <section className="p-lg pb-2xl flex flex-col gap-md sm:p-xl md:pb-2xl md:basis-2/4">
          <div className="relative -mx-lg -mt-lg sm:-mx-xl sm:-mt-xl md:hidden">
            <Image
              src={bbsigninheaderbanner}
              alt="BeezBudget Beez joyful theme header banner for sign in page"
              className="object-cover md:rounded-tr-lg md:rounded-tl-lg"
            />
            <div className="pl-lg flex items-center w-[100%] h-[100%] absolute top-0 left-0 bg-linear-to-r from-brand-strong/75 from-70% to-brand-default/20 md:rounded-tr-lg md:rounded-tl-lg">
              <BackButton
                aria-label="Go back"
                sx={{
                  color: "var(--color-dark-subtle)",
                  paddingLeft: "0.625rem",
                }}
              >
                <ArrowBackIosIcon />
              </BackButton>
            </div>
          </div>
          <div className="flex flex-col gap-xs max-md:mt-xl md:mt-md">
            <h2 className="text-xl font-bold">Log in to stay on track</h2>
            <p className="text-base md:hidden">
              Every check-in counts! Log in to update your spending and keep
              your momentum going.
            </p>
          </div>
          <SigninForm />
        </section>
      </div>
    </div>
  );
}
