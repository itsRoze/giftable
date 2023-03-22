import Link from 'next/link';
import { useState } from 'react';
import { api } from '../../../utils/api';
import NavSettings from '../../NavSettings';

const Navbar = () => {
  const friendsQuery = api.friends.getFriends.useQuery();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <nav className="flex min-h-screen w-1/6 flex-col border-r border-purple-300 bg-purple-200 shadow-[4px_1px_3px_rgba(0,0,0,0.25)]">
      <div className="custom-scroll flex-grow overflow-y-scroll">
        <ul className="menu p-4 text-base-content">
          <h3 className="text-lg font-semibold text-purple-500">Wishlists</h3>
          <li>
            <Link href="/app/wishlist">Your List</Link>
          </li>
          <li>
            <Link href="/app/giftideas">Gift Ideas</Link>
          </li>
          <h3 className="text-lg font-semibold text-purple-500">Friends</h3>
          {friendsQuery.isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <input
                type="text"
                typeof="search"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchQuery}
                className="input-bordered input w-full max-w-xs rounded-2xl bg-white"
              />
              {friendsQuery.data?.friends
                .filter((friend) => {
                  if (searchQuery === '') return friendsQuery.data?.friends;
                  return friend.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
                })
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((friend) => (
                  <li key={friend.id}>
                    <Link href={`/app/users/${encodeURIComponent(friend.id)}`}>
                      {friend.name}
                    </Link>
                  </li>
                ))}
              {searchQuery ? (
                <Link
                  className="py-5 px-2 underline"
                  href={`/app/users?search=${encodeURIComponent(searchQuery)}`}
                  onClick={() => setSearchQuery('')}
                  as={`/app/users`}
                >
                  Search for more users ↗️
                </Link>
              ) : null}
            </>
          )}
        </ul>
      </div>
      <NavSettings />
    </nav>
  );
};

export default Navbar;
