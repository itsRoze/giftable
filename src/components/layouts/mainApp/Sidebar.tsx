import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { LoadingPage } from '~/components/Loading';
import { api } from '~/utils/api';

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    data: friends,
    isLoading,
    isError,
  } = api.friends.getFriends.useQuery();

  if (isError) return <div>Error</div>;
  if (!isLoading && !friends) return <div>Not found</div>;

  const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <nav className="flex h-screen w-1/6 flex-col border-r border-r-gray-200">
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
          onChange={handleSearchQuery}
          className="w-full rounded-2xl border-2 border-gray-300 p-2"
        />
      </div>
      <ul className="m-4 flex-1 space-y-3 overflow-y-auto">
        {isLoading ? (
          <LoadingPage />
        ) : (
          friends
            .filter((friend) => {
              if (searchQuery === '') return friends;
              return friend.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            })
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((friend) => (
              <li key={friend.id}>
                <Link
                  href={`/app/users/${encodeURIComponent(friend.id)}`}
                  className="hover:underline hover:underline-offset-4"
                >
                  {friend.name} ({friend.pronouns})
                </Link>
              </li>
            ))
        )}
        {searchQuery ? (
          <div className="">
            <Link
              className="my-8 underline"
              href={`/app/users?search=${encodeURIComponent(searchQuery)}`}
              onClick={() => setSearchQuery('')}
              as={`/app/users`}
            >
              Find more users ↗️
            </Link>
          </div>
        ) : null}
      </ul>
    </nav>
  );
};

export default Sidebar;
