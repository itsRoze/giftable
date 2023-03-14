import HomeBtn from '../../components/HomeBtn';
import ItemCard from '../../components/ItemCard';
import AppLayout from '../../components/layouts/mainApp/AppLayout';
import { api } from '../../utils/api';
import { type NextPageWithLayout } from '../_app';

const GiftIdeas: NextPageWithLayout = () => {
  const { data: giftIdeas } = api.giftIdeas.getMyGiftIdeas.useQuery();
  const { data: friends } = api.friends.getFriends.useQuery();

  const renderGiftIdeas = (friendId: string) => {
    return giftIdeas?.myGiftIdeas
      .filter((idea) => idea.giftToUserId === friendId)
      .map((idea) => (
        <li key={idea.id}>
          <ItemCard item={idea} />
        </li>
      ));
  };

  const renderFriendSection = (friendId: string) => {
    const giftIdeasForFriend = renderGiftIdeas(friendId);

    return (
      <div className="collapse-content">
        {giftIdeasForFriend?.length ? (
          <ul>{giftIdeasForFriend}</ul>
        ) : (
          <p>No gift ideas yet</p>
        )}
      </div>
    );
  };

  return (
    <article className="flex h-full flex-col space-y-6">
      <HomeBtn />
      <section>
        <h1 className="mb-5 text-5xl text-green-500">Your Gift Ideas</h1>
      </section>
      {friends?.friends.map((friend) => (
        <section
          key={friend.id}
          className="collapse-arrow collapse-open collapse"
        >
          <input type="checkbox" />
          <div className="collapse-title w-11/12 text-5xl text-red-400">
            {friend.name}
          </div>
          {renderFriendSection(friend.id)}
        </section>
      ))}
    </article>
  );
};

export default GiftIdeas;

GiftIdeas.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};
