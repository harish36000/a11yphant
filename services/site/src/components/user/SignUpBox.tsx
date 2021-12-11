import clsx from "clsx";
import getConfig from "next/config";
import React from "react";

import Github from "../icons/Github";
import Twitter from "../icons/Twitter";
import InlineButton from "./InlineButton";
import SignUpForm from "./SignUpForm";
import ThirdPartyAuthLink from "./ThirdPartyAuthLink";
import { useUserAccountModalApi } from "./useUserAccountModalApi";

const { publicRuntimeConfig } = getConfig();

const SignUpBox: React.FC = () => {
  const userAccountModalApi = useUserAccountModalApi();

  return (
    <>
      {<SignUpForm />}
      <div className="mb-2">
        <ThirdPartyAuthLink href={publicRuntimeConfig.githubLoginEndpoint || "/auth/github"}>
          {"Sign up via Github"}
          <Github className={clsx("inline-block h-6 -m-2 ml-6 -mt-3 w-auto text-light", "transition duration-300", "group-hover:text-primary")} />
        </ThirdPartyAuthLink>
        <ThirdPartyAuthLink href={publicRuntimeConfig.twitterLoginEndpoint || "/auth/twitter"}>
          {"Sign up via Twitter"}
          <Twitter className={clsx("inline-block h-8 -m-2 ml-4 -mt-3 w-auto text-light", "transition duration-300", "group-hover:text-primary")} />
        </ThirdPartyAuthLink>
      </div>
      <InlineButton onClick={() => userAccountModalApi.show("login")}>Already have an account? Log in.</InlineButton>
    </>
  );
};

export default SignUpBox;
