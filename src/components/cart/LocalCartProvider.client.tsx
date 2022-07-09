import {CartProvider as ShopifyCartProvider} from '@shopify/hydrogen';
import type {CartBuyerIdentityInput} from '@shopify/hydrogen/storefront-api-types';
import {ReactNode, useCallback} from 'react';
import CartUIProvider, {useCartUI} from './CartUIProvider.client';
import {CountryCode} from '../../../node_modules/@shopify/hydrogen/dist/esnext/storefront-api-types';

/**
 * A client component that creates a cart object and provides callbacks that can be accessed by any descendent component using the `useCart` hook and related hooks
 */

type Props = {
  children: ReactNode;
  customerAccessToken?: CartBuyerIdentityInput['customerAccessToken'];
  numCartLines?: number;
  countryCode: CountryCode;
};

export default function CartProvider({
  children,
  customerAccessToken,
  numCartLines,
  countryCode,
}: Props) {
  return (
    <CartUIProvider>
      <Provider
        customerAccessToken={customerAccessToken}
        numCartLines={numCartLines}
        countryCode={countryCode}
      >
        {children}
      </Provider>
    </CartUIProvider>
  );
}

function Provider({
  children,
  customerAccessToken,
  numCartLines,
  countryCode,
}: Props) {
  const {openCart} = useCartUI();

  const open = useCallback(() => {
    openCart();
  }, [openCart]);

  return (
    <>
      <ShopifyCartProvider
        customerAccessToken={customerAccessToken}
        numCartLines={numCartLines}
        onLineAdd={open}
        onCreate={open}
        countryCode={countryCode}
      >
        {children}
      </ShopifyCartProvider>
    </>
  );
}
