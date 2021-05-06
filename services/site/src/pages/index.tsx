import ChallengeHeader from "app/components/homepage/ChallengeHeader";
import ChallengeList from "app/components/homepage/ChallengeList";
import Legend from "app/components/homepage/Legend";
import { ChallengesDocument, useChallengesQuery } from "app/generated/graphql";
import { initializeApollo } from "app/lib/apolloClient";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
const Home: React.FunctionComponent = () => {
  const {
    data: { challenges },
  } = useChallengesQuery();

  return (
    <>
      <Head>
        <title>A11yphant</title>
      </Head>
      <main className="flex flex-col h-19/20 box-border p-4">
        <ChallengeHeader className="mx-24" />
        <Legend className="mx-24" />
        <ChallengeList
          className="mx-24"
          heading={
            <>
              Easy
              <div className="w-2.5 h-5 border-2 rounded-sm border-grey bg-grey ml-4" />
              <div className="w-2.5 h-5 border-2 rounded-sm border-grey bg-transparent ml-1" />
              <div className="w-2.5 h-5 border-2 rounded-sm border-grey bg-transparent ml-1" />
            </>
          }
          completedLevel={0}
          openLevel={2}
          challenges={challenges}
        />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: ChallengesDocument,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      displayBreadcrumbs: false,
    },
  };
};

export default Home;
