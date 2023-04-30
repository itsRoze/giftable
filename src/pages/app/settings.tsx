import { UserProfile } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { type z } from 'zod';
import AppLayout from '~/components/layouts/mainApp/AppLayout';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Skeleton } from '~/components/ui/skeleton';
import { useToast } from '~/components/ui/use-toast';
import { classNames } from '~/lib/helpers';
import { userCreateSchema } from '~/lib/schemas/userCreateSchema';
import { api } from '~/utils/api';
import { type NextPageWithLayout } from '../_app';

const Settings: NextPageWithLayout = () => {
  return (
    <article className="flex h-full flex-col">
      <section className="my-8 flex flex-col items-center justify-center">
        <Menu />
      </section>
    </article>
  );
};

const Menu = () => {
  const [activeTab, setActiveTab] = useState<'account' | 'other'>('account');
  return (
    <>
      <div className="flex space-x-12">
        <button
          onClick={() => setActiveTab('account')}
          className={classNames(
            'text-3xl font-medium',
            activeTab === 'account'
              ? 'text-gray-700 underline underline-offset-8'
              : 'hover:text-gray-700'
          )}
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab('other')}
          className={classNames(
            'text-3xl font-medium',
            activeTab === 'other'
              ? 'text-gray-700 underline underline-offset-8'
              : 'hover:text-gray-700'
          )}
        >
          Other
        </button>
      </div>
      <div className="my-8 flex w-full justify-center">
        {activeTab === 'account' && <UserProfile />}
        {activeTab === 'other' && <OtherSettingsForm />}
      </div>
    </>
  );
};

type Inputs = z.infer<typeof userCreateSchema>;
const OtherSettingsForm = () => {
  const { toast } = useToast();
  const ctx = api.useContext();
  const { data: user, isLoading } = api.user.getCurrentUserDetails.useQuery();
  const { mutate, isLoading: isUpdating } =
    api.user.updateUserDetails.useMutation({
      onSuccess(data) {
        void ctx.user.invalidate();
        reset({
          name: data.name,
          pronouns: data.pronouns,
        });
      },
      onError() {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'Please try again',
        });
      },
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      name: user?.name,
      pronouns: user?.pronouns,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (!user) return;

    if (
      data.name !== user.name.trim() ||
      data.pronouns !== user.pronouns.trim()
    ) {
      mutate(data);
    }
  };

  if (isLoading) {
    return (
      <div className="w-2/3 space-y-4 rounded-lg bg-white p-10 shadow-2xl">
        <div className="space-y-2">
          <h2 className="text-3xl font-medium">Additional Details</h2>
          <h3 className="text-gray-600">
            Manage additional detials displayed on your profile
          </h3>
        </div>
        <div className="">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-20 w-1/2" />
        </div>
      </div>
    );
  }
  if (!isLoading && !user) return <div>404</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-2/3 space-y-4 rounded-lg bg-white p-10 shadow-2xl"
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-medium">Additional Details</h2>
        <h3 className="text-gray-600">
          Manage additional detials displayed on your profile
        </h3>
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label className="text-base" htmlFor="name">
          Name
        </Label>
        <Input {...register('name')} type="text" id="name" className="w-72" />
        {errors.name && (
          <p className="text-sm text-red-400">{errors.name.message}</p>
        )}
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label className="text-base" htmlFor="pronouns">
          Pronouns
        </Label>
        <Input
          {...register('pronouns')}
          type="text"
          id="pronouns"
          className="w-72"
        />
        {errors.pronouns && (
          <p className="text-sm text-red-400">{errors.pronouns.message}</p>
        )}
      </div>
      {isSubmitting || isUpdating ? (
        <Button disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving
        </Button>
      ) : (
        <Button type="submit">Save</Button>
      )}
    </form>
  );
};

Settings.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};

export default Settings;
