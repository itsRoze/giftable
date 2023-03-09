import { useSession } from 'next-auth/react';
import Carousel from '../../components/Carousel';
import NewItemForm from '../../components/forms/NewItemForm';
import AppLayout from '../../components/layouts/mainApp/AppLayout';
import WishlistGallery from '../../components/WishlistGallery';
import { api } from '../../utils/api';
import { type NextPageWithLayout } from '../_app';

const Dashboard: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const wishlistQuery = api.wishlist.getMyItems.useQuery(13);
  const friendsQuery = api.friends.getUpcomingBirthdays.useQuery(6);

  if (!session) return null;

  console.log(session);

  const cardData = [
    { id: 1, name: 'John', birthday: '01/01/2000' },
    { id: 2, name: 'Louis', birthday: '01/01/2000' },
    { id: 3, name: 'Karen', birthday: '01/01/2000' },
    { id: 4, name: 'Bree', birthday: '01/01/2000' },
  ];

  return (
    <article className="flex h-full flex-col">
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
        <WishlistGallery items={wishlistQuery.data?.items || []} />
      </section>
      <section className="">
        <h1 className="mb-5 text-5xl text-red-400">Upcoming Birthdays</h1>
        <Carousel cards={cardData} />
      </section>
    </article>
  );
};

export default Dashboard;

Dashboard.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};
