"use client";

import Image, { type StaticImageData } from "next/image";
import PrimaryButton from "@/src/components/shared/PrimaryButton";
import SecondaryButton from "@/src/components/shared/SecondaryButton";

interface ErrorViewProps {
  illustration: StaticImageData;
  illustrationAlt: string;
  title?: string;
  description?: string;
  retry?: () => void;
}

export default function ErrorView({
  illustration,
  illustrationAlt,
  title = "Something went wrong",
  description = "We couldn't load this page right now. Please try again or return to the home page.",
  retry,
}: ErrorViewProps) {
  return (
    <main className="min-h-screen bg-canvas px-md py-xl sm:px-xl sm:py-2xl">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center">
        <div
          className="relative w-full max-w-[13rem] md:max-w-[16rem] lg:max-w-[18rem]"
          aria-hidden="true"
        >
          <Image
            src={illustration}
            alt={illustrationAlt}
            priority
            sizes="(max-width: 640px) 208px, (max-width: 1024px) 256px, 288px"
            className="h-auto w-full"
          />
        </div>

        <div className="mt-lg sm:mt-xl">
          <h1 className="mt-xs text-2xl font-bold text-brand-strong sm:text-3xl">
            {title}
          </h1>
          <p className="mt-sm text-base leading-relaxed text-dark-subtle sm:text-lg">
            {description}
          </p>
        </div>

        <div className="mt-xl flex w-max flex-col gap-md sm:flex-row sm:justify-center">
          {retry ? (
            <PrimaryButton type="button" text="Try again" onClick={retry} />
          ) : null}
          <SecondaryButton type="button" text="Back to home" path="/" />
        </div>
      </div>
    </main>
  );
}
