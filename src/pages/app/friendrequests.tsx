import HomeBtn from '../../components/HomeBtn';
import AppLayout from '../../components/layouts/mainApp/AppLayout';
import UserCard from '../../components/UserCard';
import { api } from '../../utils/api';
import { type NextPageWithLayout } from '../_app';

const FriendRequests: NextPageWithLayout = () => {
  const utils = api.useContext();

  const { data: friendRequests, refetch } =
    api.friends.getFriendRequests.useQuery();
  const acceptMutation = api.friends.acceptFriendRequest.useMutation({
    onSuccess: async () => {
      await refetch();
      await utils.friends.invalidate();
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const declineMutation = api.friends.declineFriendRequest.useMutation({
    onSuccess: async () => {
      await refetch();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleAccept = (requesterId: string) => {
    acceptMutation.mutate({ requesterId });
  };

  const handleDecline = (requesterId: string) => {
    declineMutation.mutate({ requesterId });
  };

  return (
    <article className="flex h-full flex-col space-y-6">
      <HomeBtn />
      <h1 className="mb-5 text-5xl text-green-500">Friend Requests</h1>
      <section>
        <ul>
          {friendRequests?.receivedFriendRequests?.map((friendRequest) => (
            <li key={friendRequest.id}>
              <UserCard user={friendRequest.requester} />
              <div className="flex items-center space-x-3 px-8">
                <button
                  onClick={() => handleAccept(friendRequest.requesterId)}
                  className="btn border-none bg-yellow-400 text-white"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDecline(friendRequest.requesterId)}
                  className="btn border-none bg-pink-900 text-white"
                >
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};

export default FriendRequests;

FriendRequests.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};
