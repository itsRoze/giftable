import Link from 'next/link';
import { api } from '../../../utils/api';

const Navbar = () => {
  const friendsQuery = api.friends.getFriends.useQuery();

  return (
    <nav className=" drawer-mobile drawer w-1/6 border-r border-purple-300 bg-purple-200 shadow-[4px_1px_3px_rgba(0,0,0,0.25)]">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        <label
          htmlFor="my-drawer-2"
          className="btn-primary drawer-button btn lg:hidden"
        >
          Open drawer
        </label>
      </div>
      <div className="custom-scroll drawer-side overflow-y-scroll">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu w-80 p-4 text-base-content">
          <h3 className="text-lg font-semibold text-purple-500">Wishlists</h3>
          <li>
            <Link href="#">Your List</Link>
          </li>
          <li>
            <Link href="#">Friends List</Link>
          </li>
          <h3 className="text-lg font-semibold text-purple-500">Friends</h3>
          <input
            type="text"
            placeholder="Search"
            className="input-bordered input w-full max-w-xs rounded-2xl bg-white"
          />
          {friendsQuery.data?.friends
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((friend) => (
              <li key={friend.id}>
                <Link href="#">{friend.name}</Link>
              </li>
            ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
