import BackButton from "@/src/components/shared/BackButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Image from "next/image";
import beezwelcoming from "@/public/images/illustrations/beez-over-the-table.svg";
import BeezBudgetLogo, {
  BeezBudgetLogoSize,
} from "@/src/components/shared/BeezBudgetLogo";

export default function SigninBanner() {
  return (
    <section className="bg-brand-subtle rounded-tl-lg rounded-bl-lg hidden md:block md:basis-2/4">
      <div className="flex items-center justify-between px-xs mt-xl">
        <BackButton
          aria-label="Go back"
          sx={{
            color: "var(--color-dark-subtle)",
            paddingLeft: "0.625rem",
          }}
        >
          <ArrowBackIosIcon />
        </BackButton>
        <BeezBudgetLogo size={BeezBudgetLogoSize.EXTRASMALL} />
        <span>{/* Intentionally leave space for alignment */}</span>
      </div>
      <div className="p-md">
        <h1 className="font-display text-4xl text-center">
          Step into your <br /> financial hive!
        </h1>
        <div className="mt-md flex items-center justify-center">
          <Image
            src={beezwelcoming}
            alt="Image of Beez in welcoming mood for existing or new BeezBudget user"
            style={{ width: "400px", height: "auto" }}
          />
        </div>
      </div>
    </section>
  );
}
