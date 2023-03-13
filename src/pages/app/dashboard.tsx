import { useSession } from 'next-auth/react';
import BirthdayCard from '../../components/BirthdayCard';
import NewItemForm from '../../components/forms/NewItemForm';
import ItemCard from '../../components/ItemCard';
import AppLayout from '../../components/layouts/mainApp/AppLayout';
import { api } from '../../utils/api';
import { type NextPageWithLayout } from '../_app';

const Dashboard: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const { data: wishlistItems, refetch: refetchWishlist } =
    api.wishlist.getMyItems.useQuery();
  const { data: upcomingBirthdays } =
    api.friends.getUpcomingBirthdays.useQuery();

  if (!session) return null;

  return (
    <article className="flex h-full flex-col space-y-6">
      <div className="flex justify-between">
        <section className="w-1/2">
          <h1 className="mb-5 text-5xl text-green-500">
            Hey, {session.user.name}
          </h1>
          <svg width="100" height="100" viewBox="0 0 100 100">
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
        </section>
        <section className="w-1/2">
          <h1 className="mb-5 text-5xl text-red-400">New Item</h1>
          <NewItemForm refetch={refetchWishlist} />
        </section>
      </div>
      <section className="">
        <h1 className="mb-5 text-5xl text-red-400">Wishlist Items</h1>
        <ul className="grid w-9/12 grid-cols-3 gap-y-4">
          {wishlistItems?.items.map((item) => (
            <li key={item.id}>
              <ItemCard title={item.name} url={item.url} />
            </li>
          ))}
        </ul>
      </section>
      <section className="">
        <h1 className="mb-5 text-5xl text-red-400">Upcoming Birthdays</h1>
        <ul className="custom-scroll grid w-9/12 grid-cols-3 gap-y-4 overflow-y-scroll">
          {upcomingBirthdays?.friends.map((item) => (
            <li key={item.id}>
              <BirthdayCard
                birthday={item.birthday.toLocaleDateString()}
                name={item.name}
              />
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};

export default Dashboard;

Dashboard.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};
