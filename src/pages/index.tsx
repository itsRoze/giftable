import Image from 'next/image';
import PrimaryLayout from '~/components/layouts/website/PrimaryLayout';
import { type NextPageWithLayout } from '~/pages/_app';
import { motion } from 'framer-motion';

const Icons = () => {
  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
    },
  };

  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="visible"
      className="relative h-full max-h-80 w-full max-w-lg"
    >
      <motion.li key={0} variants={item}>
        <Image
          src="/images/icons/heart-icon.png"
          width={93}
          height={95}
          alt="Heart icon"
          className="absolute top-0 left-0"
        />
      </motion.li>
      <motion.li key={0} variants={item}>
        <Image
          src="/images/icons/cake-icon.png"
          width={97}
          height={100}
          alt="Cake icon"
          className="absolute top-1/3 left-2/3"
        />
      </motion.li>
      <motion.li key={0} variants={item}>
        <Image
          src="/images/icons/plus-icon.png"
          width={97}
          height={99}
          alt="Plus icon"
          className="absolute top-2/3 left-1/4"
        />
      </motion.li>
    </motion.ul>
  );
};

const Home: NextPageWithLayout = () => {
  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.5,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <>
      <div className="flex flex-col  justify-between lg:flex-row">
        <section className="w-full lg:w-2/3 xl:w-1/2">
          <div>
            <h2 className="w-fit rounded-lg bg-orange-200 p-2 font-semibold text-orange-500">
              🎂 the ultimate birthday reminder
            </h2>
            <h1 className=" text-7xl font-medium xl:text-8xl">
              Give the <span className="text-cyan-700">perfect</span> gift,
              every time ✨
            </h1>
          </div>
          <div className="flex w-full justify-center lg:hidden">
            <div className="h-48 w-1/2 ">
              <Icons />
            </div>
          </div>
        </section>
        <section className="hidden w-1/3 lg:block">
          <Icons />
        </section>
      </div>
      <section className="mt-20 flex flex-col items-center justify-center">
        <div className="w-2/3">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 1.2 }}
            variants={{
              visible: { opacity: 1 },
              hidden: { opacity: 0 },
            }}
          >
            <Image
              src="/images/web-screenshot.png"
              width={1448}
              height={1032}
              alt="Screenshot of the web app"
              className=" rounded-3xl bg-transparent shadow-2xl"
            />
          </motion.div>
        </div>
        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-8 space-y-10 text-center text-5xl font-light"
        >
          <motion.li key={0} variants={item}>
            Organize gift ideas for your friends and family.{' '}
          </motion.li>
          <motion.li key={0} variants={item}>
            Save a wishlist for yourself.{' '}
          </motion.li>
          <motion.li key={0} variants={item}>
            Never forget a special occasion again
          </motion.li>
        </motion.ul>
      </section>
      <section className="mt-20 mb-10 flex justify-center">
        <motion.button
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          variants={{
            visible: { opacity: 1 },
            hidden: { opacity: 0 },
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          className="m-1 rounded-lg bg-sky-900 p-6 text-3xl font-medium text-white shadow-md shadow-black hover:bg-sky-800  "
        >
          Get Started Today
        </motion.button>
      </section>
    </>
  );
};

Home.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export default Home;
