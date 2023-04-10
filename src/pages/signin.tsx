import PrimaryLayout from '~/components/layouts/website/PrimaryLayout';
import { type NextPageWithLayout } from '~/pages/_app';

const SignIn: NextPageWithLayout = () => {
  return (
    <article>
      <section className="flex justify-center">
        <h1 className="text-7xl font-medium xl:text-8xl">Sign In</h1>
      </section>
    </article>
  );
};

SignIn.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export default SignIn;
