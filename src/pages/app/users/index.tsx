import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AppLayout from '~/components/layouts/mainApp/AppLayout';
import { LoadingPage } from '~/components/Loading';
import { UserCard } from '~/components/UserCard';
import { type NextPageWithLayout } from '~/pages/_app';
import { api } from '~/utils/api';

const UserSearch: NextPageWithLayout = () => {
  const router = useRouter();
  const { search } = router.query;
  const [searchTerm, setSearchTerm] = useState((search as string) ?? '');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const { user: clerkUser } = useUser();

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
      <section className="mt-8 flex items-center">
        <h1 className="mr-5 text-3xl font-medium">Search results for</h1>
        <div className="relative w-1/2">
          <input
            type={'text'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full truncate bg-transparent text-3xl font-light focus:outline-none"
            placeholder="type name..."
          />
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-600"></div>
        </div>
      </section>
      <section className="my-8">
        {isLoading && <LoadingPage />}
        <ul className="space-y-8">
          {searchResults &&
            searchResults
              .filter((user) => user.authId !== clerkUser?.id)
              .map((user) => (
                <li key={user.id}>
                  <UserCard
                    id={user.id}
                    avatarUrl={user.avatarUrl}
                    name={user.name}
                    pronouns={user.pronouns}
                    birthday={user.birthday}
                  />
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
