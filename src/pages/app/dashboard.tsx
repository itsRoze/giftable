import { useSession } from 'next-auth/react';
import BirthdayCard from '../../components/BirthdayCard';
import NewItemForm from '../../components/forms/NewItemForm';
import ItemCard from '../../components/ItemCard';
import AppLayout from '../../components/layouts/mainApp/AppLayout';
import { api } from '../../utils/api';
import { type NextPageWithLayout } from '../_app';

const Dashboard: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const wishlistQuery = api.wishlist.getMyItems.useQuery(3);
  const friendsQuery = api.friends.getUpcomingBirthdays.useQuery(3);

  if (!session) return null;

  console.log(session);

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
          <NewItemForm />
        </section>
      </div>
      <section className="">
        <h1 className="mb-5 text-5xl text-red-400">Wishlist Items</h1>
        <ul className="flex space-x-6">
          {wishlistQuery.data?.items.map((item) => (
            <li key={item.id}>
              <ItemCard
                description={item.description}
                title={item.name}
                url={item.url}
              />
            </li>
          ))}
        </ul>
      </section>
      <section className="">
        <h1 className="mb-5 text-5xl text-red-400">Upcoming Birthdays</h1>
        <ul className="flex space-x-6">
          {friendsQuery.data?.items.map((item) => (
            <li key={item.id}>
              <BirthdayCard
                id={item.id}
                birthday={item.birthday}
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
