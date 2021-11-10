import { Transition } from "@headlessui/react";
import { isCodeLevel, isQuizLevel } from "app/components/challenge/helpers";
import CodeLevel from "app/components/challenge/level/CodeLevel";
import QuizLevel from "app/components/challenge/level/QuizLevel";
import SmallScreenNotification from "app/components/common/SmallScreenNotification";
import LoadingIndicator from "app/components/icons/LoadingIndicator";
import FullScreenLayout from "app/components/layouts/FullScreenLayout";
import Navigation from "app/components/Navigation";
import {
  ChallengeBySlugDocument,
  ChallengeBySlugQuery,
  ChallengeBySlugQueryVariables,
  LevelByChallengeSlugDocument,
  LevelByChallengeSlugQueryResult,
  LevelByChallengeSlugQueryVariables,
  useChallengeBySlugQuery,
  useLevelByChallengeSlugQuery,
} from "app/generated/graphql";
import { initializeApollo } from "app/lib/apollo-client";
import { getServerSideCurrentUser } from "app/lib/server-side-props/get-current-user";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

const Level: React.FunctionComponent = () => {
  const router = useRouter();
  const { challengeSlug, nthLevel } = router.query;
  const [autoSaveLoading, setAutoSaveLoading] = React.useState<boolean>(false);

  const {
    loading: loadingChallenge,
    data: { challenge },
  } = useChallengeBySlugQuery({ variables: { slug: challengeSlug as string } });

  const {
    loading,
    data: { level },
  } = useLevelByChallengeSlugQuery({
    variables: { challengeSlug: challengeSlug as string, nth: Number(nthLevel) },
  });

  if (loading || loadingChallenge) {
    return <div>Loading ...</div>;
  }

  const isLastLevel = parseInt(nthLevel as string) + 1 > challenge.levels.length;

  const header = (
    <Navigation displayBreadcrumbs>
      <Transition
        show={autoSaveLoading}
        enter="transition-opacity duration-300"
        enterTo="opacity-100"
        leave="transition-opacity duration-300 delay-1000"
        leaveTo="opacity-0"
      >
        <span>
          Saving... <LoadingIndicator className="inline ml-4" />
        </span>
      </Transition>
    </Navigation>
  );

  return (
    <>
      <Head>
        <title>
          {challenge.name} - Level {nthLevel}
        </title>
      </Head>
      <FullScreenLayout header={header}>
        <main className={clsx("max-h-full h-full", "md:p-4 md:pt-0 md:flex md:justify-between md:box-border")}>
          <h1 className="sr-only">{`${challenge.name} - Level ${nthLevel}`}</h1>
          <SmallScreenNotification />
          {isCodeLevel(level) && <CodeLevel challengeName={challenge.name} level={level} onAutoSaveLoadingChange={setAutoSaveLoading} />}
          {isQuizLevel(level) && <QuizLevel question={level.question} answers={level.answerOptions} isLastLevel={isLastLevel} levelId={level.id} />}
        </main>
      </FullScreenLayout>
    </>
  );
};

export default Level;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo(null, context);

  const { challengeSlug, nthLevel } = context.params;

  await Promise.all([
    getServerSideCurrentUser(apolloClient),
    apolloClient.query<LevelByChallengeSlugQueryResult, LevelByChallengeSlugQueryVariables>({
      query: LevelByChallengeSlugDocument,
      variables: {
        challengeSlug: challengeSlug as string,
        nth: Number(nthLevel),
      },
    }),
    apolloClient.query<ChallengeBySlugQuery, ChallengeBySlugQueryVariables>({
      query: ChallengeBySlugDocument,
      variables: {
        slug: challengeSlug as string,
      },
    }),
  ]);

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      displaySave: true,
      showScrollOverlay: false,
    },
  };
};
