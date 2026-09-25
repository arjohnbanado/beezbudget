import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import BeezLogo from "@/src/components/shared/BeezLogo";
import { Button } from "@mui/material";
import GuideView from "@/src/components/ui/GuideView";
import SignupForm from "./components/SignupForm";

export default function SignupView() {
  return (
    <div>
      <GuideView>
        <div>
          <Button
            type="button"
            variant="text"
            href="/"
            sx={{
              color: "var(--color-dark-subtle)",
              paddingLeft: "0.625rem",
            }}
          >
            <ArrowBackIosIcon />
          </Button>
        </div>
        <div className="flex justify-center">
          <BeezLogo />
        </div>
        <div className="flex flex-col gap-xs">
          <h1 className="text-xl font-bold">Start Your Sweeter Future</h1>
          <p className="text-base">
            Join BeezBudget today. Enter your email to set up your free account
            in seconds.
          </p>
        </div>
        <SignupForm />
      </GuideView>
    </div>
  );
}
