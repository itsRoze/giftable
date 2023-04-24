import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AppLayout from '~/components/layouts/mainApp/AppLayout';
import { LoadingPage } from '~/components/Loading';
import { type NextPageWithLayout } from '~/pages/_app';
import { api, type RouterOutputs } from '~/utils/api';

type UserWithAvatar = RouterOutputs['user']['find'][number];

const UserCard = ({ user }: { user: UserWithAvatar }) => {
  return (
    <Image
      src={user.avatarUrl}
      alt="User Profile Picture"
      width={50}
      height={50}
    />
  );
};

const UserSearch: NextPageWithLayout = () => {
  const router = useRouter();
  const { search } = router.query;
  const [searchTerm, setSearchTerm] = useState((search as string) ?? '');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const { data: searchResults, isLoading } =
    api.user.find.useQuery(debouncedSearchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 750);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (!isLoading && !searchResults) return <div>404</div>;

  return (
    <article className="flex flex-col">
      <section className="mt-8 flex items-center justify-center">
        <h1 className="mr-5 text-5xl font-medium">Search results for</h1>
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
      </section>
      <section>
        {isLoading && <LoadingPage />}
        <ul>
          {searchResults &&
            searchResults.map((user) => (
              <li key={user.id}>
                <UserCard user={user} />
              </li>
            ))}
        </ul>
      </section>
    </article>
  );
};

UserSearch.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};

export default UserSearch;
