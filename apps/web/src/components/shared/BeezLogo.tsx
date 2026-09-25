import Image from "next/image";
import beezlogo from "@/public/images/logos/logo-bb.svg";

export enum BeezLogoSize {
  EXTRASMALL = "xs",
  SMALL = "sm",
  MEDIUM = "md",
  LARGE = "lg",
}

interface BeezLogoProps {
  size?: BeezLogoSize;
}

const sizeMap: Record<BeezLogoSize, number> = {
  [BeezLogoSize.EXTRASMALL]: 24,
  [BeezLogoSize.SMALL]: 32,
  [BeezLogoSize.MEDIUM]: 64,
  [BeezLogoSize.LARGE]: 128,
};

export default function BeezLogo({ size = BeezLogoSize.SMALL }: BeezLogoProps) {
  const pixelWidth = sizeMap[size];

  return (
    <Image
      src={beezlogo}
      alt="Cute generic logo head of Beez of BeezBudget"
      width={pixelWidth}
      height={pixelWidth}
      style={{
        width: `${pixelWidth}px`,
        height: "auto",
      }}
    />
  );
}
