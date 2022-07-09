import {CookieSessionStorage, defineConfig} from '@shopify/hydrogen/config';

export default defineConfig({
  routes: '/src/routes/',
  shopify: {
    defaultCountryCode: 'NZ',
    defaultLanguageCode: 'EN',
    storeDomain: 'nz-single-speed.myshopify.com',
    storefrontToken: '2da721fe103bdb0e7e98da37bb5812d0',
    storefrontApiVersion: '2022-07',
  },
  session: CookieSessionStorage('__session', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 60 * 60 * 24 * 30,
  }),
});
