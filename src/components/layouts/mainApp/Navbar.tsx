import Link from 'next/link';
import { useState } from 'react';
import { api } from '../../../utils/api';

const Navbar = () => {
  const friendsQuery = api.friends.getFriends.useQuery();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <nav className="drawer-mobile drawer min-h-screen w-1/6 border-r border-purple-300 bg-purple-200 shadow-[4px_1px_3px_rgba(0,0,0,0.25)]">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="custom-scroll drawer-side overflow-y-scroll">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu w-80 p-4 text-base-content">
          <h3 className="text-lg font-semibold text-purple-500">Wishlists</h3>
          <li>
            <Link href="#">Your List</Link>
          </li>
          <li>
            <Link href="#">Gift Ideas</Link>
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
                    <Link href="#">{friend.name}</Link>
                  </li>
                ))}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
