import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useClerk, useUser } from '@clerk/nextjs';
import { GiftIcon, HeartIcon, HomeIcon } from '@heroicons/react/24/outline';
import { BellIcon, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { classNames } from '~/lib/helpers';
import { api } from '~/utils/api';

const UserBar = () => {
  const { signOut } = useClerk();
  const router = useRouter();
  const { user } = useUser();

  const { data: userDetails } = api.user.getCurrentUserDetails.useQuery();
  if (!userDetails || !user) return null;

  return (
    <div className="absolute right-0 flex items-center gap-x-4">
      <Notifications />
      <Image
        src={user.profileImageUrl}
        alt="Profile Picture"
        width={42}
        height={42}
        className="rounded-full"
      />
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center font-semibold ">
          {userDetails.name} ({userDetails.pronouns}){' '}
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => router.push('/app/settings')}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const Notifications = () => {
  const { data: numRequests } = api.friends.getFriendReqCount.useQuery();

  return (
    <Link href="/app/notifications" className="group relative">
      <BellIcon className="h-8 w-8 text-gray-500 group-hover:text-gray-700 " />
      {numRequests && numRequests > 0 ? (
        <div className="absolute top-0 right-0 rounded-full bg-blue-300 p-1"></div>
      ) : null}
    </Link>
  );
};

const DASHBOARD = '/app/[[...index]]';
const WISHLIST = '/app/wishlist';
const GIFT_IDEAS = '/app/giftideas';

const Navbar = () => {
  const router = useRouter();
  const { pathname } = router;

  const isDashboard = pathname === DASHBOARD;
  const isWishlist = pathname === WISHLIST;
  const isGiftIdeas = pathname === GIFT_IDEAS;

  return (
    <nav className="relative flex items-center justify-center">
      <div className="w-fit rounded-xl bg-sky-100 py-2 px-8">
        <div className="flex items-center gap-12">
          <Link
            href="/app"
            className={
              isDashboard
                ? 'rounded-xl bg-gray-500 p-2 shadow-md'
                : 'group rounded-xl p-2 transition-all duration-200 ease-in-out hover:bg-gray-400'
            }
          >
            <HomeIcon
              className={classNames(
                'h-8 w-8',
                isDashboard ? 'text-blue-200' : 'text-gray-500'
              )}
            />
          </Link>
          <Link
            href="/app/wishlist"
            className={
              isWishlist
                ? 'rounded-xl bg-gray-500 p-2'
                : 'group rounded-xl p-2 transition-all duration-200 ease-in-out hover:bg-gray-400'
            }
          >
            <HeartIcon
              className={classNames(
                'h-8 w-8',
                isWishlist
                  ? 'text-blue-200'
                  : 'text-gray-500 group-hover:text-blue-100'
              )}
            />
          </Link>
          <Link
            href="/app/giftideas"
            className={
              isGiftIdeas
                ? 'rounded-xl bg-gray-500 p-2'
                : 'group rounded-xl p-2 transition-all duration-200 ease-in-out hover:bg-gray-400'
            }
          >
            <GiftIcon
              className={classNames(
                'h-8 w-8',
                isGiftIdeas ? 'text-blue-200' : 'text-gray-500'
              )}
            />
          </Link>
        </div>
      </div>
      <UserBar />
    </nav>
  );
};

export default Navbar;
