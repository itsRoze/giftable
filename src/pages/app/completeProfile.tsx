import { type NextPageWithLayout } from '../_app';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

import { Button } from '@/components/ui/button';
import 'react-day-picker/dist/style.css';
import { DayPicker } from 'react-day-picker';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  birthdaySchema,
  nameSchema,
  pronounsSchema,
  userCreateSchema,
} from '~/lib/schemas/userCreateSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';
import { useToast } from '~/components/ui/use-toast';
import { type GetServerSideProps } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '~/server/db';

const CompleteProfile: NextPageWithLayout = () => {
  const [name, setName] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [birthday, setBirthday] = useState<Date>();
  const [isValid, setIsValid] = useState(false);
  const [[slide, direction], setSlide] = useState([0, 0]);
  const router = useRouter();

  const { toast } = useToast();
  const ctx = api.useContext();
  const { mutate, isLoading } = api.user.create.useMutation({
    onSuccess: () => {
      void ctx.user.invalidate();
      void router.push('/app');
    },
    onError() {
      toast({
        title: 'Uh oh!',
        description: 'Something went wrong. Please try again later.',
      });
    },
  });

  useEffect(() => {
    const result = userCreateSchema.safeParse({
      name,
      pronouns,
      birthday,
    }).success;

    setIsValid(result);
  }, [name, pronouns, birthday]);

  const paginate = (newDirection: number) => {
    setSlide([slide + newDirection, newDirection]);
  };
  const save = () => {
    if (isValid && name && pronouns && birthday)
      mutate({ name, pronouns, birthday });
  };

  return (
    <article className="flex h-screen items-center justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 75 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative h-full min-h-fit w-fit rounded-xl border border-gray-300 bg-white p-10 shadow-2xl md:h-2/3 "
      >
        <h1 className="text-5xl font-medium">
          Let&apos;s finish setting up your account
        </h1>
        <AnimatePresence initial={false} custom={direction}>
          {slide === 0 && (
            <NameSlide
              paginate={paginate}
              slide={slide}
              name={name}
              setName={setName}
            />
          )}
          {slide === 1 && (
            <PronounsSlide
              paginate={paginate}
              slide={slide}
              pronouns={pronouns}
              setPronouns={setPronouns}
            />
          )}
          {slide === 2 && (
            <BirthdaySlide
              paginate={paginate}
              slide={slide}
              date={birthday}
              setDate={setBirthday}
            />
          )}
        </AnimatePresence>
        {isLoading ? (
          <Button
            disabled
            className={`absolute right-4 bottom-0 -translate-y-1/2 transform ${
              slide !== 2 ? 'hidden' : ''
            }`}
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting
          </Button>
        ) : (
          <Button
            disabled={!isValid}
            type="submit"
            onClick={save}
            className={`absolute right-4 bottom-0 -translate-y-1/2 transform ${
              slide !== 2 ? 'hidden' : ''
            }`}
          >
            Let&apos;s go!
          </Button>
        )}
      </motion.div>
    </article>
  );
};

interface NameSlideProps {
  paginate: (newDirection: number) => void;
  slide: number;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
}
type NameInput = { name: z.infer<typeof nameSchema> };
const NameSlide: React.FC<NameSlideProps> = ({
  paginate,
  slide,
  name,
  setName,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<NameInput>({
    resolver: zodResolver(z.object({ name: nameSchema })),
    defaultValues: {
      name,
    },
  });

  useEffect(() => {
    console.log('NAME Errors', errors);
    console.log('NAME isValid', isValid);
  }, [errors, isValid]);

  const onSubmit: SubmitHandler<NameInput> = (data) => {
    setName(data.name);
    console.log(data);
    paginate(1);
  };

  return (
    <FormAnimation>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Label className="text-3xl font-medium">
          What&apos;s your name, pal?
        </Label>
        <Input
          {...register('name', {
            required: true,
            pattern: {
              value: /^[^\s]+(\s+[^\s]+)*$/,
              message: 'Name should not be empty',
            },
          })}
          type="text"
          placeholder="Enter your name"
          defaultValue={name}
          className="w-80"
        />
        {errors.name && (
          <p className="text-sm text-red-400">{errors.name.message}</p>
        )}
        <FormNavigation
          paginate={paginate}
          slide={slide}
          isValid={isValid}
          isSubmitting={isSubmitting}
        />
      </form>
    </FormAnimation>
  );
};

interface PronounsSlideProps {
  paginate: (newDirection: number) => void;
  slide: number;
  pronouns: string;
  setPronouns: React.Dispatch<React.SetStateAction<string>>;
}

type PronounsInput = { pronouns: z.infer<typeof pronounsSchema> };

const PronounsSlide: React.FC<PronounsSlideProps> = ({
  paginate,
  slide,
  pronouns,
  setPronouns,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<PronounsInput>({
    resolver: zodResolver(z.object({ pronouns: pronounsSchema })),
    defaultValues: {
      pronouns,
    },
  });

  useEffect(() => {
    console.log('PRONOUNS Errors', errors);
    console.log('PRONOUNS isValid', isValid);
  }, [errors, isValid]);

  const onSubmit: SubmitHandler<PronounsInput> = (data) => {
    setPronouns(data.pronouns);
    console.log(data);
    if (isValid) paginate(1);
  };
  return (
    <>
      <FormAnimation>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Label className="text-3xl font-medium">
            How would you like to be referred to as?
          </Label>
          <Input
            {...register('pronouns')}
            type="text"
            placeholder="E.g. he/him, they/them, she/her"
            defaultValue={pronouns}
            className="w-80"
          />
          {errors.pronouns && (
            <p className="text-sm text-red-400">{errors.pronouns.message}</p>
          )}
          <FormNavigation
            paginate={paginate}
            slide={slide}
            isValid={isValid}
            isSubmitting={isSubmitting}
          />
        </form>
      </FormAnimation>
    </>
  );
};

interface BirthdaySlideProps {
  paginate: (newDirection: number) => void;
  slide: number;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}
const BirthdaySlide: React.FC<BirthdaySlideProps> = ({
  date,
  setDate,
  paginate,
  slide,
}) => {
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState('');

  useEffect(() => {
    const result = birthdaySchema.safeParse(date);
    setIsValid(result.success);
    if (!result.success) {
      console.log(result.error);
      setErrors(result.error.errors[0]?.message ?? '');
    } else setErrors('');
  }, [date]);

  const footer = date ? (
    <p className="font-medium">You selected {format(date, 'PPP')}.</p>
  ) : (
    <p>Please pick a day.</p>
  );

  const today = new Date();
  return (
    <FormAnimation>
      <div className="space-y-4">
        <Label className="text-3xl font-medium">When were you born?</Label>
        <DayPicker
          mode="single"
          captionLayout="dropdown-buttons"
          selected={date}
          onSelect={setDate}
          fromYear={1930}
          toDate={today}
          footer={footer}
        />
        {errors && <p className="text-sm text-red-400">{errors}</p>}
        <FormNavigation paginate={paginate} slide={slide} isValid={isValid} />
      </div>
    </FormAnimation>
  );
};

interface FormAnimationProps {
  children: React.ReactNode;
}

const FormAnimation: React.FC<FormAnimationProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.5,
      }}
      className="flex flex-col py-10"
    >
      {children}
    </motion.div>
  );
};

interface FormNavigationProps {
  slide: number;
  paginate: (newDirection: number) => void;
  isValid?: boolean;
  isSubmitting?: boolean;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  slide,
  paginate,
  isValid,
  isSubmitting,
}) => {
  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        className={`absolute left-4 bottom-0 -translate-y-1/2 transform ${
          slide === 0 ? 'hidden' : 'cursor-pointer'
        }`}
        onClick={() => {
          paginate(-1);
        }}
      >
        <ArrowLeft size={48} />
      </button>
      <button
        disabled={!isValid || isSubmitting}
        type="submit"
        onKeyDown={(e) => {
          console.log(e.key);
          if (e.key === 'Enter') paginate(1);
        }}
        className={`absolute right-4 bottom-0 -translate-y-1/2 transform ${
          slide === 2 ? 'hidden' : ''
        } ${!isValid || isSubmitting ? 'cursor-not-allowed text-gray-300' : ''}
        `}
      >
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ArrowRight size={48} />
        )}
      </button>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId: authId } = getAuth(ctx.req);

  // User is not signed in
  if (!authId) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      authId: authId,
    },
  });

  // User already exists
  if (user) {
    return {
      redirect: {
        destination: '/app',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default CompleteProfile;
