import groq from 'groq';
import {IMAGE} from './image';
import {PRODUCT_WITH_VARIANT} from './productWithVariant';

export const PAGE_HERO = groq`
  module[0] {
    _type,
    (_type == 'imageWithOptions') => {
      image {
        ${IMAGE}
      },
    },
    (_type == 'productWithVariant') => {
      ...${PRODUCT_WITH_VARIANT}
    },
  },
  title
`;
