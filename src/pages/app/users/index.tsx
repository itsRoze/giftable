import { useUser } from '@clerk/nextjs';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AppLayout from '~/components/layouts/mainApp/AppLayout';
import { LoadingPage } from '~/components/Loading';
import { type NextPageWithLayout } from '~/pages/_app';
import { api, type RouterOutputs } from '~/utils/api';

type UserWithAvatar = RouterOutputs['user']['find'][number];

const UserCard = ({ user }: { user: UserWithAvatar }) => {
  return (
    <Link
      href={`/app/users/${encodeURIComponent(user.id)}`}
      className="flex w-1/2 items-center gap-2 rounded-lg hover:bg-slate-100"
    >
      <Image
        src={user.avatarUrl}
        alt="User Profile Picture"
        width={80}
        height={80}
        className="rounded-full"
      />
      <div className="flex flex-col items-start justify-start">
        <h2 className="text-xl font-medium">{user.name}</h2>
        <div className="text-gray-600">
          <p>({user.pronouns})</p>
          <p>🎂 {dayjs(user.birthday).format('MMM D')}</p>
        </div>
      </div>
    </Link>
  );
};

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
