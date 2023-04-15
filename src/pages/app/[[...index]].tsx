import dayjs from 'dayjs';
import Image from 'next/image';
import AppLayout from '../../components/layouts/mainApp/AppLayout';
import { type NextPageWithLayout } from '../_app';

interface IProfilePicture {
  picUrl: string;
  name: string;
  birthday: string;
}
const ProfilePicture: React.FC<IProfilePicture> = ({
  picUrl,
  name,
  birthday,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="h-fit w-fit rounded-full border-4 border-slate-400 p-1 transition-all duration-200 ease-in-out hover:border-indigo-300">
        <Image
          src={picUrl}
          alt="Profile Picture"
          width={70}
          height={70}
          className="rounded-full"
        />
      </div>
      <p className="font-medium text-gray-500">{name}</p>
      <p className="text-gray-500">🎂 {dayjs(birthday).format('MMM D')}</p>
    </div>
  );
};

const UpcomingBirthdays = () => {
  return (
    <section className="my-8 space-y-10">
      <h1 className="text-center text-5xl font-medium">Upcoming Birthdays</h1>
      <div className="flex justify-center gap-28">
        <ProfilePicture
          picUrl="https://xsgames.co/randomusers/assets/avatars/female/75.jpg"
          name="Marsha"
          birthday="05-9-1975"
        />
        <ProfilePicture
          picUrl="https://xsgames.co/randomusers/assets/avatars/female/68.jpg"
          name="Yasmine"
          birthday="05-15-1980"
        />
        <ProfilePicture
          picUrl="https://xsgames.co/randomusers/assets/avatars/male/71.jpg"
          name="Viktor"
          birthday="06-01-1990"
        />
      </div>
    </section>
  );
};

const Dashboard: NextPageWithLayout = () => {
  return (
    <article className="flex h-full flex-col ">
      <UpcomingBirthdays />
    </article>
  );
};

export default Dashboard;

Dashboard.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};
