import Image from 'next/image';
import PrimaryLayout from '~/components/layouts/website/PrimaryLayout';
import { type NextPageWithLayout } from '~/pages/_app';

const Icons = () => {
  return (
    <div className="relative h-full max-h-80 w-full max-w-lg">
      <Image
        src="/images/icons/heart-icon.png"
        width={93}
        height={95}
        alt="Heart icon"
        className="absolute top-0 left-0"
      />
      <Image
        src="/images/icons/cake-icon.png"
        width={97}
        height={100}
        alt="Cake icon"
        className="absolute top-1/3 left-2/3"
      />
      <Image
        src="/images/icons/plus-icon.png"
        width={97}
        height={99}
        alt="Plus icon"
        className="absolute top-2/3 left-1/4"
      />
    </div>
  );
};

const Home: NextPageWithLayout = () => {
  return (
    <>
      <section className="w-fit rounded-lg bg-orange-200 p-2">
        <h2 className="font-semibold text-orange-500">
          🎂 the ultimate birthday reminder
        </h2>
      </section>
      <div className="flex flex-col  justify-between lg:flex-row">
        <section className="w-full lg:w-2/3 xl:w-1/2">
          <h1 className="text-7xl font-medium xl:text-8xl">
            Give the <span className="text-cyan-700">perfect</span> gift, every
            time ✨
          </h1>
          <div className="flex w-full justify-center lg:hidden">
            <div className="h-48 w-1/2 ">
              <Icons />
            </div>
          </div>
          <ul className="mt-4 space-y-4 text-2xl font-light">
            <li>Organize gift ideas for your friends and family. </li>
            <li>Save a wishlist for yourself. </li>
            <li>Never forget a special occasion again</li>
          </ul>
        </section>
        <section className="hidden w-1/3 lg:block">
          <Icons />
        </section>
      </div>
    </>
  );
};

Home.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export default Home;
