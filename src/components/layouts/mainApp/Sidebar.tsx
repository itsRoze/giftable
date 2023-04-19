import { SignOutButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { LoadingPage } from '~/components/Loading';
import { api } from '~/utils/api';

const Sidebar = () => {
  const { user } = useUser();
  if (user) console.log(user);

  const {
    data: friends,
    isLoading,
    isError,
  } = api.friends.getFriends.useQuery();

  if (isError) return <div>Error</div>;
  if (!isLoading && !friends) return <div>Not found</div>;

  return (
    <nav className="flex h-screen w-1/6 flex-col">
      <Image
        src="/images/icons/giftable-icon.png"
        width={151}
        height={142}
        alt="Giftable Logo Icon"
        className="m-4 w-10"
      />
      <h1 className="m-4 text-xl font-medium">Friends</h1>
      <div className="mx-4">
        <input
          type="text"
          typeof="search"
          placeholder="Search..."
          className="w-full rounded-2xl border-2 border-gray-300 p-2"
        />
      </div>
      <ul className="m-4 flex-1 space-y-3 overflow-y-auto">
        {isLoading ? (
          <LoadingPage />
        ) : (
          friends.map((friend) => (
            <li key={friend.id}>
              <Link
                href="#"
                className="hover:underline hover:underline-offset-4"
              >
                {friend.name}{' '}
              </Link>
            </li>
          ))
        )}
      </ul>
      <SignOutButton />
    </nav>
  );
};

export default Sidebar;
