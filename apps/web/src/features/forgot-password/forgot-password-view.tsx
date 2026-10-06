import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import BeezLogo from "@/src/components/shared/BeezLogo";
import GuideView from "@/src/components/ui/GuideView";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import BackButton from "@/src/components/shared/BackButton";

export default function ForgotPasswordView() {
  return (
    <div>
      <GuideView>
        <div>
          <BackButton
            sx={{
              color: "var(--color-dark-subtle)",
              paddingLeft: "0.625rem",
            }}
          >
            <ArrowBackIosIcon />
          </BackButton>
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
