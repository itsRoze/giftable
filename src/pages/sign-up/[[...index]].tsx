import { useSignUp } from '@clerk/clerk-react';
import type { ClerkAPIError } from '@clerk/types';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { type z } from 'zod';
import { LoadingSpinner } from '~/components/Loading';
import PrimaryLayout from '~/components/layouts/website/PrimaryLayout';
import { userCreateSchema } from '~/lib/schemas/userCreateSchema';
import { type NextPageWithLayout } from '~/pages/_app';
import { api } from '~/utils/api';

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

type Inputs = z.infer<typeof userCreateSchema>;

const SignUpForm = ({
  setPendingVerification,
}: {
  setPendingVerification: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { signUp, isLoaded } = useSignUp();
  const [authErr, setAuthErr] = useState<string>();

  const ctx = api.useContext();
  const { mutate, isLoading: isCreatingUser } = api.user.create.useMutation({
    onSuccess: () => {
      void ctx.user.invalidate();
      reset();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      email: '',
      password: '',
      name: '',
      pronouns: '',
      birthdate: undefined,
    },
    resolver: zodResolver(userCreateSchema),
  });

  useEffect(() => {
    setFocus('name');
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
      mutate(data);

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
      <div className="flex w-full gap-20">
        <div className="flex w-1/2 flex-col space-y-2">
          <label className="ml-3 w-fit font-medium text-sky-900">Name</label>
          <input
            {...register('name', {
              required: true,
              pattern: {
                value: /^[^\s]+(\s+[^\s]+)*$/,
                message: 'Name should not be empty',
              },
            })}
            type="text"
            aria-invalid={errors.name ? 'true' : 'false'}
            placeholder="Tim Apple"
            className="rounded-md p-4"
            required
          />
        </div>
        <div className="flex w-1/2 flex-col space-y-2">
          <label className="ml-3 w-fit font-medium text-sky-900">
            Pronouns
          </label>
          <input
            {...register('pronouns', {
              required: true,
              pattern: {
                value: /^[^\s]+(\s+[^\s]+)*$/,
                message: 'Pronouns should not be empty',
              },
            })}
            aria-invalid={errors.name ? 'true' : 'false'}
            placeholder="e.g. he/him"
            className="rounded-md p-4"
            required
          />
        </div>
      </div>
      <div className="flex w-full pr-20">
        <div className="flex w-1/2 flex-col space-y-2">
          <label className="ml-3 w-fit font-medium text-sky-900">
            Birthdate
          </label>
          <input
            {...register('birthdate', {
              required: true,
            })}
            type="date"
            aria-invalid={errors.name ? 'true' : 'false'}
            placeholder="Tim Apple"
            className="rounded-md p-4"
            required
          />
        </div>
      </div>
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
      {errors.name && (
        <p className="mb-2 text-left text-red-400" role="alert">
          {errors.name.message}
        </p>
      )}
      {errors.pronouns && (
        <p className="mb-2 text-left text-red-400" role="alert">
          {errors.pronouns.message}
        </p>
      )}
      {errors.birthdate && (
        <p className="mb-2 text-left text-red-400" role="alert">
          {errors.birthdate.message}
        </p>
      )}
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
      {isCreatingUser ? (
        <LoadingSpinner size={48} />
      ) : (
        <button
          type="submit"
          className=" rounded-2xl bg-sky-900 p-5 shadow-md shadow-black transition duration-300 ease-in-out hover:bg-sky-800"
        >
          <ArrowRightIcon className="h-10 w-10 text-white " />
        </button>
      )}
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
    reset,
    setFocus,
    formState: { errors },
  } = useForm<VerifyFormInputs>({ defaultValues: { verificationCode: '' } });

  const ctx = api.useContext();
  const { mutate, isLoading: isCreatingUser } =
    api.user.setEmailVerified.useMutation({
      onSuccess: () => {
        void ctx.user.invalidate();
        reset();
      },
      onError: (err) => {
        console.log(err);
      },
    });

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
        // TODO: Set Verified Email as a Clerk Webhook
        mutate({ email: res.emailAddress, emailVerified: new Date() });
      }
    } catch (error) {
      const errMsg = parseErrorMessage(
        error as { errors?: ClerkAPIError[]; message?: string }
      );
      console.log(errMsg);
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
      {isCreatingUser ? (
        <LoadingSpinner size={48} />
      ) : (
        <button
          type="submit"
          className="rounded-2xl bg-sky-900 p-5 text-white shadow-md shadow-black transition duration-300 ease-in-out hover:bg-sky-800"
        >
          Submit
        </button>
      )}
    </form>
  );
};

const SignUpPage: NextPageWithLayout = () => {
  const [pendingVerifcation, setPendingVerification] = useState(false);

  return (
    <article>
      <section className="flex justify-center">
        <h1 className="text-7xl font-medium xl:text-8xl">Sign Up</h1>
      </section>
      <div className="flex justify-between py-16">
        <section className="w-1/2">
          <Image
            src="/images/cake-job.png"
            width={3382}
            height={2462}
            alt="Birthday Cake | Image by pch.vector on Freepik"
            className="w-50"
          />
        </section>
        <section className="w-1/2 px-10 py-4">
          {pendingVerifcation ? (
            <div className="space-y-10">
              <p className="text-xl">
                We just sent you a verification code! Enter it here so that we
                can be sure your email is legit and finish signing you up
              </p>
              <VerifyCodeForm />
            </div>
          ) : (
            <SignUpForm setPendingVerification={setPendingVerification} />
          )}
        </section>
      </div>
    </article>
  );
};

SignUpPage.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export default SignUpPage;
