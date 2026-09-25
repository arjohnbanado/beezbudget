import Image from "next/image";
import bblogo from "@/public/images/logos/logo-text-bb.png";

export enum BeezBudgetLogoSize {
  EXTRASMALL = "xs",
  SMALL = "sm",
  MEDIUM = "md",
  LARGE = "lg",
  EXTRALARGE = "xl",
}

interface BeezBudgetLogoProps {
  size?: BeezBudgetLogoSize;
  className?: string;
}

const sizeMap: Record<BeezBudgetLogoSize, number> = {
  [BeezBudgetLogoSize.EXTRASMALL]: 96,
  [BeezBudgetLogoSize.SMALL]: 128,
  [BeezBudgetLogoSize.MEDIUM]: 160,
  [BeezBudgetLogoSize.LARGE]: 192,
  [BeezBudgetLogoSize.EXTRALARGE]: 256,
};

export default function BeezBudgetLogo({
  size = BeezBudgetLogoSize.SMALL,
  className = "",
}: BeezBudgetLogoProps) {
  const pixelWidth = sizeMap[size];

  return (
    <Image
      src={bblogo}
      alt="BeezBudget"
      width={pixelWidth}
      height={pixelWidth}
      className={className}
      style={{
        width: `${pixelWidth}px`,
        height: "auto",
      }}
    />
  );
}
