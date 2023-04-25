import dayjs from 'dayjs';
import {
  type InferGetServerSidePropsType,
  type GetServerSideProps,
} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import NewGiftForm from '~/components/forms/NewGiftForm';
import AppLayout from '~/components/layouts/mainApp/AppLayout';
import { LoadingPage } from '~/components/Loading';
import { WishlistGallery } from '~/components/wishlist';
import { classNames } from '~/lib/helpers';
import { type NextPageWithLayout } from '~/pages/_app';
import { generateSSRHelper } from '~/server/helpers/ssrHelper';
import { api, type RouterOutputs } from '~/utils/api';

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const UserProfilePage: NextPageWithLayout<PageProps> = ({ id }) => {
  const { data: user, isLoading } = api.user.getProfile.useQuery({ id });
  if (isLoading) return <LoadingPage />;
  if (!isLoading && (!user || !user.userId)) return <div>404</div>;

  return (
    <article className="flex flex-col">
      <section className="my-8">
        <UserCard {...user} />
      </section>
      <section className="my-8 flex flex-col items-center">
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
}) => {
  return (
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
    </div>
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
  const ssr = generateSSRHelper();

  const id = context.params?.id;
  if (typeof id !== 'string') {
    throw new Error('no user ID');
  }

  await ssr.user.getProfile.prefetch({ id });

  return {
    props: {
      trpcState: ssr.dehydrate(),
      id,
    },
  };
};

UserProfilePage.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};

export default UserProfilePage;
