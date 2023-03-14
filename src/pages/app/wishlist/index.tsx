import { useSession } from 'next-auth/react';
import NewItemForm from '../../../components/forms/NewItemForm';
import HomeBtn from '../../../components/HomeBtn';
import ItemCard from '../../../components/ItemCard';
import AppLayout from '../../../components/layouts/mainApp/AppLayout';
import { api } from '../../../utils/api';
import { type NextPageWithLayout } from '../../_app';

const Wishlist: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const { data: wishlistItems, refetch: refetchWishlist } =
    api.wishlist.getMyItems.useQuery();

  if (!session) return <p>Loading</p>;

  return (
    <article className="flex h-full flex-col space-y-6">
      <HomeBtn />
      <section>
        <h1 className="mb-5 text-5xl text-green-500">Your Wishlist</h1>
      </section>
      <section className="w-1/2">
        <h1 className="mb-5 text-5xl text-red-400">New Item</h1>
        <NewItemForm refetch={refetchWishlist} />
      </section>
      <section>
        <ul className="grid w-9/12 grid-cols-3 gap-y-4">
          {wishlistItems?.items.map((item) => (
            <li key={item.id}>
              <ItemCard item={item} />
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};

export default Wishlist;

Wishlist.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};
