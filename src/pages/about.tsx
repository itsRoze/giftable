import { motion } from 'framer-motion';
import Image from 'next/image';
import PrimaryLayout from '~/components/layouts/website/PrimaryLayout';
import { classNames } from '~/lib/helpers';
import { type NextPageWithLayout } from '~/pages/_app';

const BuyMeACoffee = () => {
  return (
    <motion.a
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.8 }}
      href="https://www.buymeacoffee.com/roze"
      target="_blank"
      className="w-36 rounded-2xl bg-rose-400 py-4 hover:bg-rose-300 md:w-56"
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
        <span
          className={classNames('font-cookie text-xl text-white md:text-3xl')}
        >
          Buy Me a Chai
        </span>
      </div>
    </motion.a>
  );
};

const About: NextPageWithLayout = () => {
  const variants = {
    hidden: { opacity: 0, x: -200, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -100 },
  };

  return (
    <article>
      <motion.div
        variants={variants} // Pass the variant object into Framer Motion
        initial="hidden" // Set the initial state to variants.hidden
        animate="enter" // Animated state to variants.enter
        exit="exit" // Exit state (used later) to variants.exit
        transition={{ type: 'linear' }} // Set the transition to linear
      >
        <section className="flex justify-center">
          <h1 className="text-4xl font-medium lg:text-7xl xl:text-8xl">
            About
          </h1>
        </section>
        <section className="mt-8 flex flex-col items-center justify-center py-4">
          <h2 className="text-2xl font-semibold text-gray-700 md:text-4xl">
            Hello 👋🏼
          </h2>
          <h2 className="text-2xl font-semibold text-gray-700 md:text-4xl">
            My name is Roze{' '}
          </h2>
          <Image
            src="/images/profile.png"
            width={552}
            height={552}
            alt="Artistic photo of the author"
            className="h-60 w-60 md:h-96 md:w-96"
          />
        </section>
        <section className="flex items-center justify-center py-4 md:py-10">
          <h3 className="px-10 text-center text-lg font-medium md:px-0 md:text-3xl">
            I am the{' '}
            <span className="border-b-4 border-b-green-300">founder</span>,{' '}
            <span className="border-b-4 border-b-blue-300">engineer</span>, and{' '}
            <span className="border-b-4 border-b-red-300 ">designer</span> of{' '}
            <span className=" text-blue-700">Giftable</span>
          </h3>
        </section>
        <section className="flex flex-col items-center justify-center py-2">
          <p className="mb-6 font-light md:text-2xl  xl:w-1/2">
            With Giftable, I wanted to make a simpler way of keeping track of my
            friends&apos; birthdays and gift ideas. I hope this app also works
            out for you! If you&apos;d like to support me, please consider
            getting me a chai 😊
          </p>
          <BuyMeACoffee />
        </section>
      </motion.div>
    </article>
  );
};

About.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export default About;
