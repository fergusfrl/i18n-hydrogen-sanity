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

function App({
  request,
  response,
  country = {isoCode: 'US'},
}: HydrogenRouteProps) {
  const pathname = new URL(request.normalizedUrl).pathname;
  const localeMatch = /^\/([a-z]{2})(\/|$)/i.exec(pathname);
  const countryCode = localeMatch ? (localeMatch[1] as CountryCode) : undefined;

  const clientCountryCode = request?.headers.get('x-nf-geo')?.country?.code;

  console.log(country);

  // TODO: redirect on initial load only.
  if (clientCountryCode && countryCode != clientCountryCode.toLowerCase()) {
    response.doNotStream();
    response.redirect(
      clientCountryCode !== DEFAULT_ISO_CODE
        ? `/${clientCountryCode.toLowerCase()}/`
        : '/',
    );
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
