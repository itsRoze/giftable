import { UserProfile } from '@clerk/nextjs';
import AppLayout from '~/components/layouts/mainApp/AppLayout';
import { type NextPageWithLayout } from '../_app';

const Settings: NextPageWithLayout = () => {
  return (
    <article className="flex h-full flex-col">
      <div className="my-8 flex justify-center">
        <UserProfile />
      </div>
    </article>
  );
};

Settings.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};

export default Settings;
