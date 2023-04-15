import AppLayout from '~/components/layouts/mainApp/AppLayout';
import { type NextPageWithLayout } from '../_app';

const Wishlist: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Wishlist</h1>
    </div>
  );
};

Wishlist.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};

export default Wishlist;
