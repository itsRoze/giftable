import { SignIn } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import PrimaryLayout from '~/components/layouts/website/PrimaryLayout';
import { type NextPageWithLayout } from '~/pages/_app';

const SignInPage: NextPageWithLayout = () => {
  const variants = {
    hidden: { opacity: 0, x: -200, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -100 },
  };

  return (
    <motion.article
      variants={variants} // Pass the variant object into Framer Motion
      initial="hidden" // Set the initial state to variants.hidden
      animate="enter" // Animated state to variants.enter
      exit="exit" // Exit state (used later) to variants.exit
      transition={{ type: 'linear' }} // Set the transition to linear
    >
      <section className="flex justify-center">
        <h1 className="text-4xl font-medium lg:text-7xl xl:text-8xl">Login</h1>
      </section>
      <section className="flex justify-center py-16">
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          redirectUrl="/app"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-sky-900 hover:bg-sky-800',
              card: 'w-full h-auto',
            },
          }}
        />
      </section>
    </motion.article>
  );
};

SignInPage.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export default SignInPage;
