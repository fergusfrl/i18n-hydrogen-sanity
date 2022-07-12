import PicoSanity from 'picosanity';
import {HydrogenUseQueryOptions, useQuery, useUrl} from '@shopify/hydrogen';
import sanityConfig from '../../sanity.config';

interface Props {
  /** A string of the GROQ query. */
  query: string;
  /** An object of the variables for the GROQ query. */
  params?: Record<string, unknown>;
  /** Query options to pass to Hydrogen's `useQuery` hook */
  hydrogenQueryOptions?: HydrogenUseQueryOptions;
}

// Standard client for fetching data
const sanityClient = new PicoSanity(sanityConfig);

// Authenticated client for fetching draft documents
const previewClient = new PicoSanity({
  ...sanityConfig,
  useCdn: false,
  withCredentials: true,
  token:
    'sknOJJoz8a93klR0kOmexF5QQGrAgySVK6WYHwXFNofIsdf5iZxdak7AZMM4hxoIbh5T8BC0pjaFTo5kiqmzQ4AW1U9gG4Upt4LtglqYjjU2t9FhC7r2vXNonR4MEIbTBxVJduhmQm6lgoqCArtvV2SO9TTPA4bpoxcgICkSjw6dsoxPie7J',
});

// Helper function to choose the correct client
const getClient = (usePreview = false) =>
  usePreview ? previewClient : sanityClient;

export default function useSanityQuery<T>({
  hydrogenQueryOptions,
  query,
  params = {},
}: Props) {
  // Check for preview link.
  const isPreview = useUrl()?.searchParams.get('preview') === 'true';

  return useQuery<T>(
    JSON.stringify([query, params]),
    async () => await getClient(isPreview).fetch(query, params),
    hydrogenQueryOptions,
  );
}
