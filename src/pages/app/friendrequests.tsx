import FriendRequestHandleBtn from '../../components/FriendRequestHandleBtn';
import HomeBtn from '../../components/HomeBtn';
import AppLayout from '../../components/layouts/mainApp/AppLayout';
import UserCard from '../../components/UserCard';
import { api } from '../../utils/api';
import { type NextPageWithLayout } from '../_app';

const FriendRequests: NextPageWithLayout = () => {
  const { data: friendRequests, refetch } =
    api.friends.getFriendRequests.useQuery();

  return (
    <article className="flex h-full flex-col space-y-6">
      <HomeBtn />
      <h1 className="mb-5 text-5xl text-green-500">Friend Requests</h1>
      <section>
        <ul>
          {friendRequests?.receivedFriendRequests?.map((friendRequest) => (
            <li key={friendRequest.id}>
              <UserCard user={friendRequest.requester} />
              <FriendRequestHandleBtn
                refetch={refetch}
                requesterId={friendRequest.requesterId}
              />
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
