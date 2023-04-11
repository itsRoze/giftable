import { SignIn } from '@clerk/nextjs';
import PrimaryLayout from '~/components/layouts/website/PrimaryLayout';
import { type NextPageWithLayout } from '~/pages/_app';

const SignInPage: NextPageWithLayout = () => {
  return (
    <article>
      <section className="flex justify-center">
        <h1 className="text-7xl font-medium xl:text-8xl">Login</h1>
      </section>
      <section className="flex justify-center py-16">
        <SignIn path="/signin" routing="path" signUpUrl="/signup" />
      </section>
    </article>
  );
};

SignInPage.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export default SignInPage;
