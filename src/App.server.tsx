import {
  FileRoutes,
  PerformanceMetrics,
  PerformanceMetricsDebug,
  Route,
  Router,
  ShopifyAnalytics,
  ShopifyProvider,
  useQuery,
  type HydrogenRouteProps,
} from '@shopify/hydrogen';
import renderHydrogen from '@shopify/hydrogen/entry-server';
import type {CountryCode} from '@shopify/hydrogen/storefront-api-types';
import {Suspense} from 'react';
import ServerCartProvider from './components/cart/ServerCartProvider.server';
import DefaultSeo from './components/DefaultSeo.server';
import LoadingFallback from './components/global/LoadingFallback';
import NotFound from './components/global/NotFound.server';
import {DEFAULT_ISO_CODE} from './constants';

import requestIp from 'request-ip';

function App({request, response}: HydrogenRouteProps) {
  const pathname = new URL(request.normalizedUrl).pathname;
  const localeMatch = /^\/([a-z]{2})(\/|$)/i.exec(pathname);
  const countryCode = localeMatch ? (localeMatch[1] as CountryCode) : undefined;

  const {data} = useQuery(['geo', 'value'], async () => {
    const ip = requestIp.getClientIp(request) || '207.97.227.239';
    const geo = await (
      await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`)
    ).json();
    return geo;
  });

  if (data.countryCode && data.countryCode !== countryCode) {
    // TODO: relocated on client - not on server.
    response.redirect(`/${data.countryCode.toLowerCase()}/`);
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <p>{data.countryCode}</p>
      <ShopifyProvider countryCode={countryCode || DEFAULT_ISO_CODE}>
        <ServerCartProvider countryCode={countryCode || DEFAULT_ISO_CODE}>
          <DefaultSeo />
          <Router>
            {/* Prefix subfolder routes here */}
            <FileRoutes
              basePath={countryCode ? `/${countryCode}/` : undefined}
            />
            {/* @ts-expect-error <NotFound> doesn't require response */}
            <Route path="*" page={<NotFound />} />
          </Router>
        </ServerCartProvider>
        <PerformanceMetrics />
        {import.meta.env.DEV && <PerformanceMetricsDebug />}
        <ShopifyAnalytics />
      </ShopifyProvider>
    </Suspense>
  );
}

export default renderHydrogen(App);
