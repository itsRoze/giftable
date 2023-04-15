import AppLayout from '~/components/layouts/mainApp/AppLayout';
import { type NextPageWithLayout } from '../_app';

const GiftIdeas: NextPageWithLayout = () => {
  return (
    <div>
      <h1>GiftIdeas</h1>
    </div>
  );
};

GiftIdeas.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};

export default GiftIdeas;
