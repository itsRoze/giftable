import { GiftIcon, HeartIcon, HomeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { classNames } from '~/lib/helpers';

const DASHBOARD = '/app/[[...index]]';
const WISHLIST = '/app/wishlist';
const GIFT_IDEAS = '/app/gift-ideas';

const Navbar = () => {
  const router = useRouter();
  const { pathname } = router;

  const isDashboard = pathname === DASHBOARD;
  const isWishlist = pathname === WISHLIST;
  const isGiftIdeas = pathname === GIFT_IDEAS;

  return (
    <nav className="flex justify-center">
      <div className="w-fit rounded-xl bg-sky-100 py-4 px-10">
        <div className="flex items-center gap-32">
          <Link
            href="#"
            className={isDashboard ? 'rounded-xl bg-gray-500 p-2' : 'p-2'}
          >
            <HomeIcon
              className={classNames(
                'h-9 w-9',
                isDashboard ? 'text-blue-200' : 'text-gray-500'
              )}
            />
          </Link>
          <Link
            href="#"
            className={
              isWishlist
                ? 'rounded-xl bg-gray-500 p-2'
                : 'group rounded-xl p-2 transition-all duration-200 ease-in-out hover:bg-gray-400'
            }
          >
            <HeartIcon
              className={classNames(
                'h-9 w-9',
                isWishlist
                  ? 'text-blue-200'
                  : 'text-gray-500 group-hover:text-blue-100'
              )}
            />
          </Link>
          <Link
            href="#"
            className={
              isGiftIdeas
                ? 'rounded-xl bg-gray-500 p-2'
                : 'group rounded-xl p-2 transition-all duration-200 ease-in-out hover:bg-gray-400'
            }
          >
            <GiftIcon
              className={classNames(
                'h-9 w-9',
                isGiftIdeas ? 'text-blue-200' : 'text-gray-500'
              )}
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
