import { ApolloClient, from, HttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { NextSSRApolloClient, NextSSRInMemoryCache, SSRMultipartLink } from "@apollo/experimental-nextjs-app-support/ssr";
import { ErrorDialogApi, useErrorDialogApi } from "app/components/common/error/useErrorDialog";
import { createErrorLink } from "app/lib/apollo-client/create-error-link";
import crossFetch from "cross-fetch";
import { GetServerSidePropsContext } from "next";
import { useMemo } from "react";

import { createForwardCookiesToClientLink } from "./create-forward-cookies-to-client-link";
import { createForwardCookiesToServerLink } from "./create-forward-cookies-to-server-link";

let apolloClient: ApolloClient<NormalizedCacheObject>;

export function createApolloClientSSR(uri: string, errorDialogApi: ErrorDialogApi): ApolloClient<NormalizedCacheObject> {
  const isServer = typeof window === "undefined";
  const httpLink = new HttpLink({
    uri,
    fetchOptions: { cache: "no-store" },
  });

  const links = [createForwardCookiesToClientLink(), createForwardCookiesToServerLink(), createErrorLink({ errorDialogApi }), httpLink];

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: from(isServer ? [new SSRMultipartLink({ stripDefer: true }), ...links] : links),
    credentials: "same-site",
  });
}

function createApolloClient(
  uri: string,
  context: GetServerSidePropsContext | null = null,
  errorDialogApi: ErrorDialogApi | undefined,
): ApolloClient<NormalizedCacheObject> {
  const isServer = typeof window === "undefined";
  const httpLink = new HttpLink({
    uri,
    fetch: crossFetch,
  });

  const getCookieHeader = (): string | null => {
    return context?.req?.headers?.cookie ?? null;
  };

  return new ApolloClient({
    ssrMode: isServer,
    // the http link has to be at the end because it is a terminating link
    link: from([createForwardCookiesToServerLink(getCookieHeader), createErrorLink({ errorDialogApi }), httpLink]),
    cache: new InMemoryCache(),
    credentials: "same-site",
  });
}

export function initializeApollo(
  uri: string,
  initialState: NormalizedCacheObject | null = null,
  context: GetServerSidePropsContext | null = null,
  errorDialogApi?: ErrorDialogApi,
): ApolloClient<NormalizedCacheObject> {
  const _apolloClient = apolloClient ?? createApolloClient(uri, context, errorDialogApi);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Restore the cache using the data passed from getStaticProps/getServerSideProps
    // combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
}

export function useApollo(
  uri: string,
  initialState: NormalizedCacheObject,
  customErrorDialogApi?: ErrorDialogApi,
): ApolloClient<NormalizedCacheObject> {
  const internalErrorDialogApi = useErrorDialogApi();
  const errorDialogApi = customErrorDialogApi ?? internalErrorDialogApi;

  const store = useMemo(() => initializeApollo(uri, initialState, null, errorDialogApi), [errorDialogApi, initialState]);
  return store;
}
