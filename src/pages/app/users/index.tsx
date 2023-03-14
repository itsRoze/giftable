import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AppLayout from '../../../components/layouts/mainApp/AppLayout';
import UserCard from '../../../components/UserCard';
import { api } from '../../../utils/api';
import { type NextPageWithLayout } from '../../_app';

const UsersSearch: NextPageWithLayout = () => {
  const router = useRouter();
  const { search } = router.query;
  const [searchTerm, setSearchTerm] = useState(search as string);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const { data: searchResults } =
    api.user.findUsers.useQuery(debouncedSearchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 750);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <article className="flex h-full flex-col space-y-6">
      <Link
        href="/app/dashboard"
        className="btn-circle btn border-none bg-indigo-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="h-8 w-8 text-indigo-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
      </Link>
      <section className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-center">
          <h1 className="mr-5 text-5xl text-green-500">Search Results for</h1>
          <div className="relative">
            <input
              type={'text'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-96 truncate bg-transparent text-5xl font-light focus:outline-none"
              placeholder="type name..."
            />
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-600"></div>
          </div>
        </div>
      </section>
      <section>
        <ul>
          {searchResults?.map((user) => (
            <li key={user.id}>
              <UserCard user={user} />
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};

export default UsersSearch;

UsersSearch.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};
