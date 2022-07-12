import sanityClient from 'picosanity';
import {HydrogenUseQueryOptions, useQuery, CacheShort} from '@shopify/hydrogen';
import sanityConfig from '../../sanity.config';

interface Props {
  /** A string of the GROQ query. */
  query: string;
  /** An object of the variables for the GROQ query. */
  params?: Record<string, unknown>;
  /** Query options to pass to Hydrogen's `useQuery` hook */
  hydrogenQueryOptions?: HydrogenUseQueryOptions;
}

const client = new sanityClient(sanityConfig);

export default function useSanityQuery<T>({
  hydrogenQueryOptions,
  query,
  params = {},
}: Props) {
  return useQuery<T>(
    JSON.stringify([query, params]),
    async () => {
      const result = await client.fetch(query, params);
      return result;
    },
    {
      ...hydrogenQueryOptions,
      cache: CacheShort(),
    },
  );
}
