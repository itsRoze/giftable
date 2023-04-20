import { PlusIcon } from '@heroicons/react/24/outline';
import type { WishlistItem } from '@prisma/client';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import NewItemForm from '~/components/forms/NewItemForm';
import { LoadingPage } from '~/components/Loading';
import { api } from '~/utils/api';
import AppLayout from '../../components/layouts/mainApp/AppLayout';
import { type NextPageWithLayout } from '../_app';

interface IProfilePicture {
  picUrl: string | null;
  name: string;
  birthday: Date;
}
const ProfilePicture: React.FC<IProfilePicture> = ({
  picUrl,
  name,
  birthday,
}) => {
  return (
    <div className="flex flex-col items-center">
      <Link
        href="#"
        className="h-fit w-fit rounded-full border-4 border-slate-400 p-1 transition-all duration-200 ease-in-out hover:border-indigo-300"
      >
        <Image
          src={
            picUrl ??
            'https://xsgames.co/randomusers/assets/avatars/female/68.jpg'
          }
          alt="Profile Picture"
          width={70}
          height={70}
          className="rounded-full"
        />
      </Link>
      <p className="font-medium text-gray-500">{name}</p>
      <p className="text-gray-500">🎂 {dayjs(birthday).format('MMM D')}</p>
    </div>
  );
};

const UpcomingBirthdays = () => {
  const { data, isLoading, isError } =
    api.friends.getUpcomingBirthdays.useQuery();

  if (isLoading) return <LoadingPage />;
  if (isError || (!isLoading && !data)) return <div>404</div>;

  return (
    <section className="my-8 space-y-10">
      <h1 className="text-center text-5xl font-medium">Upcoming Birthdays</h1>
      <div className="flex justify-center gap-28">
        {data.friends.map((user) => (
          <ProfilePicture
            key={user.userId}
            picUrl={user.image}
            name={user.name}
            birthday={user.birthday}
          />
        ))}
      </div>
    </section>
  );
};

const WishlistCard = ({ item }: { item: WishlistItem }) => {
  return (
    <Link
      href={item.url ?? '#'}
      target="_blank"
      className="w-72 max-w-lg transform space-y-5 rounded-md border border-gray-200 bg-white pb-16 shadow-xl transition duration-300 ease-in-out md:hover:-translate-y-1 md:hover:scale-105 md:hover:bg-gray-100"
    >
      <div className="relative h-40 w-full rounded-t-md">
        {item.imageUrl && (
          <Image
            src={item.imageUrl}
            alt="Item image"
            fill
            sizes="100vw"
            style={{
              objectFit: 'cover',
            }}
          />
        )}
      </div>
      <div className="space-y-5 px-3">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-medium">{item.name}</h3>
          <button className="rounded-3xl p-1 hover:bg-slate-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </button>
        </div>
        <p className="leading-loose text-gray-600 line-clamp-3">
          {item.description}
        </p>
      </div>
    </Link>
  );
};

const Wishlist = () => {
  const {
    data: wishlist,
    isLoading,
    isError,
  } = api.user.getWishlistForCurrentUser.useQuery();

  if (isLoading) return <LoadingPage />;
  if (isError || (!isLoading && !wishlist)) return <div>404</div>;

  return (
    <section className="flex flex-col space-y-6">
      <div className="flex items-center justify-center">
        <h1 className="flex-1 text-center text-5xl font-medium">Wishlist</h1>
        <NewItemForm />
      </div>
      <div className="grid grid-cols-2 gap-4 py-2 xl:grid-cols-3 2xl:grid-cols-4">
        {wishlist.map((item) => (
          <div key={item.id} className="flex justify-center">
            <WishlistCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
};

const Dashboard: NextPageWithLayout = () => {
  return (
    <article className="flex h-full flex-col">
      <UpcomingBirthdays />
      <Wishlist />
    </article>
  );
};

export default Dashboard;

Dashboard.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};
