import {useSession} from '@shopify/hydrogen';
import {ReactNode} from 'react';
import {CountryCode} from '../../../node_modules/@shopify/hydrogen/dist/esnext/storefront-api-types';
import LocalCartProvider from './LocalCartProvider.client';

type Props = {
  children: ReactNode;
  countryCode: CountryCode;
};

export default function ServerCartProvider({children, countryCode}: Props) {
  const {customerAccessToken} = useSession();

  return (
    <LocalCartProvider
      customerAccessToken={customerAccessToken}
      countryCode={countryCode}
    >
      {children}
    </LocalCartProvider>
  );
}
