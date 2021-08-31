import Card from "app/components/homepage/Card";
import { ChallengeOverviewFragment } from "app/generated/graphql";
import clsx from "clsx";
import React from "react";

interface ChallengeListProps {
  className?: string;
  heading: React.ReactNode;
  completedLevel: number;
  openLevel: number;
  challenges: ChallengeOverviewFragment[];
}

const ChallengeList: React.FunctionComponent<ChallengeListProps> = ({ className, heading, completedLevel, openLevel, challenges }) => {
  return (
    <div className={clsx("mt-2 mb-6 flex flex-col items-start", className)}>
      <div className="mx-4 mb-6 flex flex-row items-center">
        <h3 className={clsx("mb-0 flex items-center text-grey font-bold leading-10", "h4")}>
          <span className="sr-only">Difficulty </span>
          {heading}
        </h3>
        <p className={clsx("ml-4 mb-0 text-grey font-normal", "h4")} aria-hidden="true">
          {`(${completedLevel}/${openLevel})`}
        </p>
        <p className="sr-only">{`${completedLevel} of ${openLevel} challenges completed`}</p>
      </div>
      <ul className="flex">
        {challenges.map((challenge) => (
          <Card
            key={challenge.id}
            className="mr-24"
            challengeSlug={challenge.slug}
            heading={challenge.name}
            levels={challenge.levels.length}
            difficulty={challenge.difficulty}
            challengeNumber={challenges.length}
          />
        ))}
      </ul>
    </div>
  );
};

export default ChallengeList;
