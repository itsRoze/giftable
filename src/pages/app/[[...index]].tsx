import type { WishlistItem } from '@prisma/client';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import NewItemForm from '~/components/forms/NewItemForm';
import { LoadingPage } from '~/components/Loading';
import { api } from '~/utils/api';
import AppLayout from '../../components/layouts/mainApp/AppLayout';
import { type NextPageWithLayout } from '../_app';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, MoreVertical, Trash2 } from 'lucide-react';
import { useToast } from '~/components/ui/use-toast';
import { useState } from 'react';
import UpdateItemForm from '~/components/forms/UpdateItemForm';
import { classNames } from '~/lib/helpers';

interface IProfilePicture {
  picUrl: string | null;
  name: string;
  birthday: Date;
}
const ProfilePicture: React.FC<IProfilePicture> = ({
  picUrl,
  name,
  birthday,
}) => {
  return (
    <div className="flex flex-col items-center">
      <Link
        href="#"
        className="h-fit w-fit rounded-full border-4 border-slate-400 p-1 transition-all duration-200 ease-in-out hover:border-indigo-300"
      >
        <Image
          src={
            picUrl ??
            'https://xsgames.co/randomusers/assets/avatars/female/68.jpg'
          }
          alt="Profile Picture"
          width={70}
          height={70}
          className="rounded-full"
        />
      </Link>
      <p className="font-medium text-gray-500">{name}</p>
      <p className="text-gray-500">🎂 {dayjs(birthday).format('MMM D')}</p>
    </div>
  );
};

const UpcomingBirthdays = () => {
  const { data, isLoading, isError } =
    api.friends.getUpcomingBirthdays.useQuery();

  if (isLoading) return <LoadingPage />;
  if (isError || (!isLoading && !data)) return <div>404</div>;

  return (
    <section className="my-8 space-y-10">
      <h1 className="text-center text-5xl font-medium">Upcoming Birthdays</h1>
      <div className="flex justify-center gap-28">
        {data.friends.length === 0 && (
          <p className="italic">Woah, no birthdays for two months!</p>
        )}
        {data.friends.map((user) => (
          <ProfilePicture
            key={user.userId}
            picUrl={user.avatarUrl}
            name={user.name}
            birthday={user.birthday}
          />
        ))}
      </div>
    </section>
  );
};

// TODO: Figure out why refactoring the popover outside this file looses styling
const WishlistPopover = ({ item }: { item: WishlistItem }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const { toast } = useToast();
  const ctx = api.useContext();
  const { mutate } = api.wishlist.remove.useMutation({
    onSuccess() {
      void ctx.user.invalidate();
      toast({
        description: `${item.name} removed from your wishlist`,
      });
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message ?? 'Please try again',
      });
    },
  });
  return (
    <>
      <UpdateItemForm item={item} open={openEdit} setOpen={setOpenEdit} />
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-3xl p-1 hover:bg-slate-300">
          <MoreVertical className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => mutate({ itemId: item.id })}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Remove</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const WishlistCard = ({ item }: { item: WishlistItem }) => {
  return (
    <Link
      href={item.url ?? '#'}
      target="_blank"
      className="w-72 max-w-lg transform space-y-5 rounded-md border border-gray-200 bg-white pb-16 shadow-xl transition duration-300 ease-in-out md:hover:-translate-y-1 md:hover:scale-105 md:hover:bg-gray-100"
    >
      <div className="relative h-40 w-full rounded-t-md">
        {item.imageUrl && (
          <Image
            src={item.imageUrl}
            alt="Item image"
            fill
            sizes="100vw"
            style={{
              objectFit: 'cover',
            }}
          />
        )}
      </div>
      <div className="space-y-5 px-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium line-clamp-1">{item.name}</h3>
          <WishlistPopover item={item} />
        </div>
        <p className="leading-loose text-gray-600 line-clamp-3">
          {item.description}
        </p>
      </div>
    </Link>
  );
};

const Gallery = ({ wishlist }: { wishlist: WishlistItem[] }) => {
  const size = wishlist.length;

  if (size === 0) {
    return <p>No wishes 😭</p>;
  }

  return (
    <div
      className={classNames(
        'grid gap-4 py-2',
        size >= 4 ? 'grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : '',
        size === 3 ? 'grid-cols-2 xl:grid-cols-3' : '',
        size === 2 ? 'grid-cols-2' : ''
      )}
    >
      {wishlist.map((item) => (
        <div key={item.id} className="flex justify-center">
          <WishlistCard item={item} />
        </div>
      ))}
    </div>
  );
};

const Wishlist = () => {
  const {
    data: wishlist,
    isLoading,
    isError,
  } = api.user.getWishlistForCurrentUser.useQuery();

  if (isLoading) return <LoadingPage />;
  if (isError || (!isLoading && !wishlist)) return <div>404</div>;

  return (
    <section className="flex flex-col space-y-6">
      <div className="flex items-center justify-center">
        <h1 className="flex-1 text-center text-5xl font-medium">Wishlist</h1>
        <NewItemForm />
      </div>
      <Gallery wishlist={wishlist} />
    </section>
  );
};

const Dashboard: NextPageWithLayout = () => {
  return (
    <article className="flex h-full flex-col">
      <UpcomingBirthdays />
      <Wishlist />
    </article>
  );
};

export default Dashboard;

Dashboard.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};
