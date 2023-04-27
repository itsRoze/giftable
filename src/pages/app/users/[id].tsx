import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@clerk/nextjs';
import dayjs from 'dayjs';
import { Edit, MoreVertical, Trash2, UserPlus, X } from 'lucide-react';
import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { LoadingPage } from '~/components/Loading';
import NewGiftForm from '~/components/forms/NewGiftForm';
import UpdateGiftForm from '~/components/forms/UpdateGiftForm';
import AppLayout from '~/components/layouts/mainApp/AppLayout';
import { Button } from '~/components/ui/button';
import { useToast } from '~/components/ui/use-toast';
import { WishlistGallery } from '~/components/wishlist';
import { classNames } from '~/lib/helpers';
import { type NextPageWithLayout } from '~/pages/_app';
import { generateSSHelper } from '~/server/helpers/ssHelper';
import { api, type RouterOutputs } from '~/utils/api';

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const UserProfilePage: NextPageWithLayout<PageProps> = ({ id }) => {
  const router = useRouter();
  const { user: clerkUser } = useUser();
  const { data: user, isLoading } = api.user.getProfile.useQuery({ id });

  useEffect(() => {
    if (clerkUser && user && clerkUser.id === user.authId)
      void router.push('/app');
  }, [clerkUser, router, user]);

  if (isLoading) return <LoadingPage />;
  if (!isLoading && !user) return <div>404</div>;

  if (clerkUser && user && clerkUser.id === user.authId) {
    return <LoadingPage />;
  }

  return (
    <article className="flex flex-col">
      <section className="my-8">
        <UserCard {...user} />
      </section>
      <section className="my-16 flex flex-col items-center">
        <ListMenu {...user} />
      </section>
    </article>
  );
};

type UserProfile = RouterOutputs['user']['getProfile'];
const UserCard: React.FC<UserProfile> = ({
  avatarUrl,
  name,
  pronouns,
  birthday,
  id,
}) => {
  const { data: friendStatus } = api.friends.getFriendStatus.useQuery(id);

  const isFriend = friendStatus?.status === 'ACCEPTED';
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center justify-center space-x-4">
        <Image
          src={avatarUrl}
          alt="Profile Picture"
          width={90}
          height={90}
          className="rounded-full"
        />
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">{name}</h1>
          <div className="flex items-center justify-evenly text-gray-600">
            <h2>({pronouns})</h2>
            <h2>🎂 {dayjs(birthday).format('MMM D')}</h2>
          </div>
        </div>
        {isFriend && <FriendMenu id={id} />}
      </div>
      {(friendStatus?.status === 'REJECTED' || !friendStatus?.status) && (
        <AddFriendBtn id={id} />
      )}
      {friendStatus?.status === 'PENDING' && <CancelFriendReqBtn id={id} />}
    </div>
  );
};

const AddFriendBtn: React.FC<{ id: string }> = ({ id }) => {
  const { toast } = useToast();
  const ctx = api.useContext();
  const { mutate, isLoading } = api.friends.sendFriendRequest.useMutation({
    onSuccess() {
      void ctx.friends.invalidate();
    },
    onError() {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Please try again later.',
      });
    },
  });

  return (
    <Button disabled={isLoading} onClick={() => mutate({ requestedId: id })}>
      <UserPlus className="mr-2 h-4 w-4" /> <span>Add friend</span>
    </Button>
  );
};

const CancelFriendReqBtn: React.FC<{ id: string }> = ({ id }) => {
  const { toast } = useToast();
  const ctx = api.useContext();
  const { mutate, isLoading } = api.friends.cancelFriendRequest.useMutation({
    onSuccess() {
      void ctx.friends.invalidate();
    },
    onError() {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Please try again later.',
      });
    },
  });

  return (
    <Button
      variant="secondary"
      disabled={isLoading}
      onClick={() => mutate({ requestedId: id })}
    >
      <X className="mr-2 h-4 w-4" /> Cancel Request
    </Button>
  );
};

const FriendMenu: React.FC<{ id: string }> = ({id}) => {
  const ctx = api.useContext();
  const { toast } = useToast();
  const {mutate: unfriendMutate } = api.friends.removeFriend.useMutation({
    onSuccess() {
      void ctx.friends.invalidate();
    },
    onError() {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Please try again later.',
      });
    },

  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical className="h-6 w-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => unfriendMutate({ friendId: id})}>Unfriend</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ListMenu: React.FC<UserProfile> = ({
  id,
  wishlist,
  friendsGiftIdeas,
}) => {
  const [activeTab, setActiveTab] = useState<'wishlist' | 'gifts'>('wishlist');

  return (
    <>
      <div className="flex space-x-12">
        <button
          onClick={() => setActiveTab('wishlist')}
          className={classNames(
            'text-3xl font-medium',
            activeTab === 'wishlist'
              ? 'text-gray-700 underline underline-offset-8'
              : 'hover:text-gray-700'
          )}
        >
          Wishlist
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('gifts')}
            className={classNames(
              'text-3xl font-medium',
              activeTab === 'gifts'
                ? 'text-gray-700 underline underline-offset-8'
                : 'hover:text-gray-700'
            )}
          >
            <span>Your Gift Ideas</span>
          </button>
          <div onClick={() => setActiveTab('gifts')}>
            <NewGiftForm giftToUserId={id} />
          </div>
        </div>
      </div>
      <section className="py-6">
        {activeTab === 'wishlist' ? (
          <WishlistGallery wishlist={wishlist} />
        ) : (
          <GiftIdeaGallery giftIdeas={friendsGiftIdeas} />
        )}
      </section>
    </>
  );
};

const GiftPopover: React.FC<{
  giftIdea: UserProfile['friendsGiftIdeas'][number];
}> = ({ giftIdea }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const { toast } = useToast();
  const ctx = api.useContext();
  const { mutate } = api.gift.remove.useMutation({
    onSuccess() {
      void ctx.user.invalidate();
      toast({
        description: `${giftIdea.name} removed from your wishlist`,
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
      <UpdateGiftForm
        giftIdea={giftIdea}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-3xl p-1 hover:bg-slate-300">
          <MoreVertical className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => mutate({ itemId: giftIdea.id })}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Remove</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const GiftIdea: React.FC<{
  giftIdea: UserProfile['friendsGiftIdeas'][number];
}> = ({ giftIdea }) => {
  return (
    <Link
      href={giftIdea.url ?? '#'}
      target="_blank"
      className="w-72 max-w-lg transform space-y-5 rounded-md border border-gray-200 bg-white pb-16 shadow-xl transition duration-300 ease-in-out md:hover:-translate-y-1 md:hover:scale-105 md:hover:bg-gray-100"
    >
      <div className="relative h-40 w-full rounded-t-md">
        {giftIdea.imageUrl && (
          <Image
            src={giftIdea.imageUrl}
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
          <h3 className="text-xl font-medium line-clamp-1">{giftIdea.name}</h3>
          <GiftPopover giftIdea={giftIdea} />
        </div>
        <p className="leading-loose text-gray-600 line-clamp-3">
          {giftIdea.description}
        </p>
      </div>
    </Link>
  );
};

const GiftIdeaGallery: React.FC<{
  giftIdeas: UserProfile['friendsGiftIdeas'];
}> = ({ giftIdeas }) => {
  const size = giftIdeas.length;

  if (size === 0) {
    return <p>Add some ideas for your friend 💝</p>;
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
      {giftIdeas.map((giftIdea) => (
        <div key={giftIdea.id} className="flex justify-center">
          <GiftIdea giftIdea={giftIdea} />
        </div>
      ))}
    </div>
  );
};

interface Props {
  id: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const ss = generateSSHelper();

  const id = context.params?.id;
  if (typeof id !== 'string') {
    throw new Error('no user ID');
  }

  await ss.user.getProfile.prefetch({ id });

  return {
    props: {
      trpcState: ss.dehydrate(),
      id,
    },
  };
};

UserProfilePage.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};

export default UserProfilePage;
