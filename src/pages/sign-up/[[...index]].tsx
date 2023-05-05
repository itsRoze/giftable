import { useSignUp } from '@clerk/clerk-react';
import type { ClerkAPIError } from '@clerk/types';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import PrimaryLayout from '~/components/layouts/website/PrimaryLayout';
import { LoadingSpinner } from '~/components/Loading';
import { Button } from '~/components/ui/button';
import { type NextPageWithLayout } from '~/pages/_app';

const parseErrorMessage = (err: {
  errors?: ClerkAPIError[];
  message?: string;
}) => {
  const DEFAULT_ERROR_MESSAGE =
    "Uh oh! We ran into an unknown error. Try again later and hopefully it'll be resolved";

  if (!err) {
    return DEFAULT_ERROR_MESSAGE;
  }

  if (err.errors) {
    return err.errors?.[0]?.longMessage ?? DEFAULT_ERROR_MESSAGE;
  }

  return err?.message ?? DEFAULT_ERROR_MESSAGE;
};

type Inputs = {
  email: string;
  password: string;
};

const SignUpForm = ({
  setPendingVerification,
}: {
  setPendingVerification: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { signUp, isLoaded } = useSignUp();
  const [authErr, setAuthErr] = useState<string>();

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  if (!isLoaded) return <LoadingSpinner />;

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      // Create a new sign-up with the supplied email and password.
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      // Send a one-time code to the email
      await signUp.prepareVerification({
        strategy: 'email_code',
      });

      // Create user but dont set verified

      setPendingVerification(true);
      reset();
    } catch (error) {
      const errMsg = parseErrorMessage(
        error as { errors?: ClerkAPIError[]; message?: string }
      );
      setAuthErr(errMsg);
    }
  };

  return (
    <form className="w-full space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-2">
        <label className="ml-3 w-fit font-medium text-sky-900">Email</label>
        <input
          {...register('email', {
            required: true,
            pattern: {
              value: /^[^\s]+(\s+[^\s]+)*$/,
              message: 'Email should not be empty',
            },
          })}
          type="email"
          aria-invalid={errors.email ? 'true' : 'false'}
          placeholder="timapple@email.com"
          className="rounded-md p-4"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label className="ml-3 w-fit font-medium text-sky-900">Password</label>
        <input
          {...register('password', {
            required: true,
          })}
          type="password"
          aria-invalid={errors.password ? 'true' : 'false'}
          placeholder="********"
          className="rounded-md p-4"
        />
      </div>
      {errors.email && (
        <p className="mb-2 text-left text-red-400" role="alert">
          {errors.email.message}
        </p>
      )}
      {errors.password && (
        <p className="mb-2 text-left text-red-400" role="alert">
          {errors.password.message}
        </p>
      )}
      {authErr && (
        <p className="mb-2 text-left text-red-400" role="alert">
          {authErr}
        </p>
      )}
      <Button
        disabled={isSubmitting}
        type="submit"
        className=" h-fit w-fit rounded-2xl bg-sky-900 p-5 shadow-md shadow-black transition duration-300 ease-in-out hover:bg-sky-800"
      >
        {isSubmitting ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin md:h-10  md:w-10" />
        ) : (
          <ArrowRightIcon className="h-5 w-5 text-white md:h-10 md:w-10 " />
        )}
      </Button>
    </form>
  );
};

type VerifyFormInputs = {
  verificationCode: string;
};

const VerifyCodeForm: React.FC = () => {
  const { signUp, isLoaded, setSession } = useSignUp();
  const [authErr, setAuthErr] = useState<string>();

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<VerifyFormInputs>({ defaultValues: { verificationCode: '' } });

  useEffect(() => {
    setFocus('verificationCode');
  }, [setFocus]);

  if (!isLoaded) return <LoadingSpinner />;

  const onSubmit: SubmitHandler<VerifyFormInputs> = async (data) => {
    try {
      const res = await signUp.attemptVerification({
        code: data.verificationCode,
        strategy: 'email_code',
      });

      if (res.status === 'complete' && res.emailAddress) {
        await setSession(res.createdSessionId);
      }
    } catch (error) {
      const errMsg = parseErrorMessage(
        error as { errors?: ClerkAPIError[]; message?: string }
      );
      setAuthErr(errMsg);
    }
  };

  return (
    <form className="w-full space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-2">
        <label className="ml-3 w-fit font-medium text-sky-900">Code</label>
        <input
          {...register('verificationCode', {
            required: true,
          })}
          autoComplete="off"
          type="text"
          aria-invalid={errors.verificationCode ? 'true' : 'false'}
          className="rounded-md p-4"
        />
      </div>
      {errors.verificationCode && (
        <p className="mb-2 text-left text-red-400" role="alert">
          {errors.verificationCode.message}
        </p>
      )}
      {authErr && (
        <p className="mb-2 text-left text-red-400" role="alert">
          {authErr}
        </p>
      )}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-16 w-24 rounded-2xl bg-sky-900 p-5 text-white shadow-md shadow-black transition duration-300 ease-in-out hover:bg-sky-800"
      >
        {isSubmitting || true ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin md:h-10 md:w-10" />
        ) : (
          <p className="text-lg">Submit</p>
        )}
      </Button>
    </form>
  );
};

const SignUpPage: NextPageWithLayout = () => {
  const [pendingVerifcation, setPendingVerification] = useState(false);

  const variants = {
    hidden: { opacity: 0, x: -200, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -100 },
  };

  const reverseVariants = {
    hidden: { opacity: 0, x: 200, y: 0 },
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
        <h1 className="text-4xl font-medium lg:text-7xl xl:text-8xl">
          Sign Up
        </h1>
      </section>
      <div className="flex flex-col items-center justify-between py-16 xl:flex-row">
        <section className="w-3/4 xl:w-1/2">
          <Image
            src="/images/cake-job.png"
            width={3382}
            height={2462}
            alt="Birthday Cake | Image by pch.vector on Freepik"
            className="w-50"
          />
        </section>
        <section className="w-full py-4 xl:w-1/2 xl:px-10">
          {pendingVerifcation ? (
            <motion.div
              variants={reverseVariants} // Pass the variant object into Framer Motion
              initial="hidden" // Set the initial state to variants.hidden
              animate="enter" // Animated state to variants.enter
              exit="exit" // Exit state (used later) to variants.exit
              transition={{ type: 'linear' }} // Set the transition to linear
              className="space-y-10"
            >
              <p className="text-xl">
                We just sent you a verification code! Enter it here so that we
                can be sure your email is legit and finish signing you up
              </p>
              <VerifyCodeForm />
            </motion.div>
          ) : (
            <SignUpForm setPendingVerification={setPendingVerification} />
          )}
        </section>
      </div>
    </motion.article>
  );
};

SignUpPage.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export default SignUpPage;
