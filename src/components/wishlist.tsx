import { type WishlistItem } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { classNames } from '~/lib/helpers';

export const WishlistCard = ({ item }: { item: WishlistItem }) => {
  return (
    <Link
      href={item.url ?? '#'}
      target="_blank"
      className="w-72 max-w-lg transform space-y-5 rounded-md border border-gray-200 bg-white pb-16 shadow-xl transition duration-300 ease-in-out md:hover:-translate-y-1 md:hover:scale-105 md:hover:bg-gray-100"
    >
      <div className="relative h-40 w-full rounded-t-md">
        {item.imageUrl && (
          <Image
            src={item.imageUrl}
            alt="Item image"
            fill
            sizes="100vw"
            style={{
              objectFit: 'cover',
            }}
          />
        )}
      </div>
      <div className="space-y-5 px-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium line-clamp-1">{item.name}</h3>
        </div>
        <p className="leading-loose text-gray-600 line-clamp-3">
          {item.description}
        </p>
      </div>
    </Link>
  );
};

export const WishlistGallery = ({ wishlist }: { wishlist: WishlistItem[] }) => {
  const size = wishlist.length;

  if (size === 0) {
    return <p>No wishes 😭</p>;
  }

  return (
    <div
      className={classNames(
        'grid gap-4 py-2',
        size >= 4 ? 'grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : '',
        size === 3 ? 'grid-cols-2 xl:grid-cols-3' : '',
        size === 2 ? 'grid-cols-2' : ''
      )}
    >
      {wishlist.map((item) => (
        <div key={item.id} className="flex justify-center">
          <WishlistCard item={item} />
        </div>
      ))}
    </div>
  );
};
