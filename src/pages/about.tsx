import Image from 'next/image';
import PrimaryLayout from '~/components/layouts/website/PrimaryLayout';
import { classNames } from '~/lib/helpers';
import { type NextPageWithLayout } from '~/pages/_app';

const BuyMeACoffee = () => {
  return (
    <a
      href="https://www.buymeacoffee.com/roze"
      target="_blank"
      className="w-56 rounded-2xl bg-rose-400 py-4 hover:bg-pink-300"
      rel="noreferrer"
    >
      <div className="flex items-center justify-center space-x-3">
        <Image
          src="/images/icons/bmc-logo.png"
          width={1768}
          height={2558}
          alt="Buy Me a Coffee Logo"
          className="w-5"
        />
        <span className={classNames('font-cookie text-3xl text-white')}>
          Buy Me a Chai
        </span>
      </div>
    </a>
  );
};

const About: NextPageWithLayout = () => {
  return (
    <article>
      <section className="flex justify-center">
        <h1 className="text-7xl font-medium xl:text-8xl">About</h1>
      </section>
      <section className="flex flex-col items-center justify-center py-4">
        <h2 className="text-3xl font-semibold text-gray-700 md:text-4xl">
          Hello 👋🏼
        </h2>
        <h2 className="text-3xl font-semibold text-gray-700 md:text-4xl">
          My name is Roze{' '}
        </h2>
        <Image
          src="/images/profile.png"
          width={552}
          height={552}
          alt="Artistic photo of the author"
          className="h-96 w-96"
        />
      </section>
      <section className="flex items-center justify-center py-4 md:py-10">
        <h3 className="text-2xl font-medium md:text-3xl">
          I am the{' '}
          <span className="border-b-4 border-b-green-300">founder</span>,{' '}
          <span className="border-b-4 border-b-blue-300">engineer</span>, and{' '}
          <span className="border-b-4 border-b-red-300 ">designer</span> of{' '}
          <span className=" text-blue-700">Giftable</span>
        </h3>
      </section>
      <section className="flex flex-col items-center justify-center py-2">
        <p className="mb-6 w-1/2 text-xl font-light md:text-2xl">
          I&apos;m an indie software engineer with a passion for building
          helpful apps that make people&apos;s lives easier. With Giftable, I
          wanted to make a simpler way of keeping track of my friends&apos;
          birthdays and gift ideas. I hope this app also works out for you! If
          you&apos;d like to support me, please consider getting me a chai 😊
        </p>
        <BuyMeACoffee />
      </section>
    </article>
  );
};

About.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export default About;
