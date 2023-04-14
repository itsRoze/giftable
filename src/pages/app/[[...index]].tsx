import AppLayout from '../../components/layouts/mainApp/AppLayout';
import { type NextPageWithLayout } from '../_app';

const Dashboard: NextPageWithLayout = () => {
  return (
    <article className="flex h-full flex-col space-y-6">
      <h1>Dashboard</h1>
    </article>
  );
};

export default Dashboard;

Dashboard.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};
