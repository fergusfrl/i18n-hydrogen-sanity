import {Image, Link} from '@shopify/hydrogen';

/**
 * A shared component that defines a single featured collection to display on a storefront
 */
export default function FeaturedCollection({collection}) {
  return collection ? (
    <div className="grid grid-cols-1 items-center gap-2 overflow-hidden lg:grid-cols-2">
      {collection.image ? (
        <Image data={collection.image} height="465" width="622" />
      ) : null}
      <div className="py-10 lg:py-0">
        {/* Title */}
        <h2 className="mb-5 font-medium">{collection.title}</h2>

        {/* Description */}
        <p className="mb-6">{collection.description}</p>

        <Link className="btn" to={`/collections/${collection.handle}`}>
          Shop Collection
        </Link>
      </div>
    </div>
  ) : null;
}
