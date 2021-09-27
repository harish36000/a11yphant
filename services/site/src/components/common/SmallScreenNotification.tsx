import clsx from "clsx";
import Link from "next/link";
import React from "react";

import IllustrationCodingMan from "../icons/IllustrationCodingMan";

const SmallScreenNotification: React.FunctionComponent = () => {
  return (
    <>
      <section className={clsx("mx-8 py-10 flex flex-col justify-center items-left", "lg:hidden")}>
        <IllustrationCodingMan className={clsx("max-w-xs min-h-4/10 self-start", "sm:max-w-sm")} />
        <h2 className={clsx("mb-8 mt-12", "h3", "sm:h2 sm:mt-12")}>Your device is too small</h2>
        <p>Please use a tablet or desktop device with a larger screen or rotate your device.</p>
        <Link href="/">
          <a
            className={clsx(
              "w-max mt-4 px-4 py-2 font-normal bg-primary text-white border-primary border-2 rounded tracking-wider inline-flex items-center",
              "transition duration-300",
              "hover:text-white hover:bg-primary-dark hover:border-primary-dark",
              "focus:text-white focus:bg-primary-dark focus:border-primary-dark",
            )}
          >
            Go to homepage
          </a>
        </Link>
      </section>
    </>
  );
};

export default SmallScreenNotification;
