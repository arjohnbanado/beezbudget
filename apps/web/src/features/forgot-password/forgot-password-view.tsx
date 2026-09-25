import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import BeezLogo from "@/src/components/shared/BeezLogo";
import { Button } from "@mui/material";
import GuideView from "@/src/components/ui/GuideView";
import ForgotPasswordForm from "./components/ForgotPasswordForm";

export default function ForgotPasswordView() {
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
          <h1 className="text-xl font-bold">Forgot Your Password?</h1>
          <p className="text-base">
            Don’t worry, it happens! Enter the email address linked to your
            account, and we’ll send you a link to reset it.
          </p>
        </div>
        <ForgotPasswordForm />
      </GuideView>
    </div>
  );
}
