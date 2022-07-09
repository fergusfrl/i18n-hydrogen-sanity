import {
  FileRoutes,
  PerformanceMetrics,
  PerformanceMetricsDebug,
  Route,
  Router,
  ShopifyAnalytics,
  ShopifyProvider,
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

import geoip from 'geoip-lite';
import requestIp from 'request-ip';

function App({request, response}: HydrogenRouteProps) {
  const pathname = new URL(request.normalizedUrl).pathname;
  const localeMatch = /^\/([a-z]{2})(\/|$)/i.exec(pathname);
  const countryCode = localeMatch ? (localeMatch[1] as CountryCode) : undefined;

  const ip = requestIp.getClientIp(request);
  const clientCountryCode = geoip.lookup(ip)?.country?.toLowerCase();

  console.log('EVALUATED_COUNTRY_CODE:', clientCountryCode);

  // TODO: fix becasue this currently overwrites the dropdown.
  if (clientCountryCode && clientCountryCode !== countryCode) {
    response.redirect(`/${clientCountryCode}/`);
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
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
