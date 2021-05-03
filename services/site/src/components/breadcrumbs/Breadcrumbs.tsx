import { useApolloClient } from "@apollo/client";
import { BreadcrumbInfo, useRoutes } from "app/components/breadcrumbs/routes";
import Slash from "app/components/icons/Slash";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Breadcrumbs: React.FunctionComponent = () => {
  const router = useRouter();
  const routes = useRoutes();
  const apolloClient = useApolloClient();

  const [routeList, setRouteList] = React.useState<BreadcrumbInfo[]>([]);

  const getRouteList = React.useCallback(async (): Promise<BreadcrumbInfo[]> => {
    const urlParams = router.query;
    const pathname = router.pathname;
    const pathnameArr = pathname.split("/");

    return pathnameArr.reduce<Promise<BreadcrumbInfo[]>>(async (routeInfoList, pathSegment, idx) => {
      const pathname = pathnameArr.slice(0, idx + 1).join("/") || "/";

      if (routes[pathname]) {
        const routeInfo = await routes[pathname].getBreadcrumbInfo(urlParams, apolloClient);
        const existingRouteInfoList = await routeInfoList;
        return [...existingRouteInfoList, routeInfo];
      }

      return routeInfoList;
    }, Promise.resolve([]));
  }, [router.pathname]);

  React.useEffect(() => {
    // Workaround for `Warning: Can't perform a React state update on an unmounted component.`
    // as seen here: https://stackoverflow.com/a/60907638
    let isMounted = true;

    const asyncGetRouteList = async (): Promise<BreadcrumbInfo[]> => {
      return getRouteList();
    };

    asyncGetRouteList().then((routeList) => {
      if (isMounted) {
        setRouteList(routeList);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [getRouteList]);

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center">
        {routeList.map((route, idx) => {
          return (
            <li key={route.href}>
              <div className="flex items-center">
                {idx > 0 && <Slash />}
                <Link href={route.href}>
                  <a className={`${idx === routeList.length - 1 && "text-primary"} ml-1 text-gray-500 hover:text-primaryDark`}>{route.breadcrumb}</a>
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
