import { PlusIcon } from '@heroicons/react/24/outline';
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

const WishlistCard = () => {
  return (
    <div className="w-72 max-w-lg transform space-y-5 rounded-md border border-gray-200 bg-white pb-16 shadow-xl transition duration-300 ease-in-out md:hover:-translate-y-1 md:hover:scale-105 md:hover:bg-gray-100">
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src="https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/94e70add-d590-4327-9b9c-c8a65b3cf541/air-max-270-womens-shoes-Pgb94t.png"
          alt="Nike Shoes"
          fill
          sizes="100vw"
          style={{
            objectFit: 'cover',
          }}
        />
      </div>
      <div className="space-y-5 px-3">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-medium">Nike Shoes</h3>
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut dignissim
          ante. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
          dignissim ante
        </p>
      </div>
    </div>
  );
};

const Wishlist = () => {
  return (
    <section className="overflow-y-scroll">
      <div className="flex items-center justify-center">
        <h1 className="flex-1 text-center text-5xl font-medium">Wishlist</h1>
        <button className="rounded-xl hover:bg-slate-300">
          <PlusIcon className="h-12 w-12 stroke-[3]" />
        </button>
      </div>
      <WishlistCard />
    </section>
  );
};

const Dashboard: NextPageWithLayout = () => {
  return (
    <article className="flex h-full flex-col ">
      <UpcomingBirthdays />
      <Wishlist />
    </article>
  );
};

export default Dashboard;

Dashboard.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};
