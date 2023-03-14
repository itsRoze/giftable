import { FriendStatus } from '@prisma/client';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AddFriendBtn from '../../../components/AddFriendBtn';
import CancelRequestBtn from '../../../components/CancelRequestBtn';
import ItemCard from '../../../components/ItemCard';
import AppLayout from '../../../components/layouts/mainApp/AppLayout';
import { api } from '../../../utils/api';
import { type NextPageWithLayout } from '../../_app';

const UserProfile: NextPageWithLayout = () => {
  const { query } = useRouter();
  const { data: user, isLoading } = api.user.getProfile.useQuery(
    query.id as string
  );
  const { data: friendStatus, refetch: refetchStatus } =
    api.user.getFriendRelation.useQuery(query.id as string);

  if (isLoading || !user) {
    return <p>Loading...</p>;
  }

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
        <h1 className="mb-5 text-5xl text-green-500">{user.name}</h1>
        <h2 className="py-1 text-xl">({user.pronouns})</h2>
        <h2 className="py-1 text-xl">
          🎂 {moment(user.birthday).format('MMMM, DD')}
        </h2>
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          className="my-4 h-40 w-40"
        >
          <rect width="100%" height="100%" fill="#9792e3" />
          <circle cx="30" cy="30" r="4" fill="black" />
          <circle cx="70" cy="30" r="4" fill="black" />
          <path
            d="M 30 50 Q 50 60 70 50"
            stroke="black"
            strokeWidth="5"
            fill="none"
          />
        </svg>
        {friendStatus?.status === FriendStatus.ACCEPTED ? (
          <h2 className="text-2xl">Friends</h2>
        ) : friendStatus?.status === FriendStatus.PENDING ? (
          <CancelRequestBtn
            userId={query.id as string}
            refetch={refetchStatus}
          />
        ) : (
          <AddFriendBtn userId={query.id as string} refetch={refetchStatus} />
        )}
      </section>
      <section>
        <h1 className="mb-5 text-5xl text-red-400">
          {user.name}&apos;s Wishlist
        </h1>
        <ul className="grid w-9/12 grid-cols-3 gap-y-4">
          {user.wishlist.map((item) => (
            <li key={item.id}>
              <ItemCard title={item.name} url={item.url} />
            </li>
          ))}
        </ul>
      </section>
      {friendStatus?.status === FriendStatus.ACCEPTED ? (
        <section>
          <h1 className="mb-5 text-5xl text-red-400">
            Your Gift Ideas for {user.name}
          </h1>
        </section>
      ) : null}
    </article>
  );
};

export default UserProfile;

UserProfile.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};
