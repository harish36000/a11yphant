import { useRouter } from "next/router";
import React from "react";

const challengeSlug = "accessible-links";
const nthLevel = "01";

const Challenge: React.FunctionComponent = () => {
  const router = useRouter();

  // @TODO: Remove once /challenges exists
  React.useEffect(() => {
    router.push(`challenge/${challengeSlug}/level/${nthLevel}`);
  }, []);

  return <div />;
};

export default Challenge;
