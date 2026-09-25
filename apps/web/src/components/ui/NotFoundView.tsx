"use client";

import Image from "next/image";
import PrimaryButton from "@/src/components/shared/PrimaryButton";
import SecondaryButton from "@/src/components/shared/SecondaryButton";
import notFoundBeez from "@/public/images/illustrations/beez-notFound-sad-mood.svg";

export interface NotFoundViewProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function NotFoundView({
  title = "We couldn't find that page",
  description = "The page may have moved, the link may be broken, or the information is no longer available.",
  actionLabel = "Back to home",
  actionHref = "/",
}: NotFoundViewProps) {
  return (
    <main className="min-h-screen bg-canvas px-md py-xl sm:px-xl sm:py-2xl">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center">
        <div
          className="relative w-full max-w-[13rem] md:max-w-[16rem] lg:max-w-[18rem]"
          aria-hidden="true"
        >
          <Image
            src={notFoundBeez}
            alt=""
            priority
            sizes="(max-width: 640px) 288px, 352px"
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
          <PrimaryButton type="button" text={actionLabel} path={actionHref} />
          <SecondaryButton
            type="button"
            text="Go back"
            onClick={() => window.history.back()}
          />
        </div>
      </div>
    </main>
  );
}
