import PrimaryLayout from '~/components/layouts/website/PrimaryLayout';
import { type NextPageWithLayout } from '~/pages/_app';

const Signup: NextPageWithLayout = () => {
  return (
    <article>
      <section className="flex justify-center">
        <h1 className="text-7xl font-medium xl:text-8xl">Sign Up</h1>
      </section>
    </article>
  );
};

Signup.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export default Signup;
