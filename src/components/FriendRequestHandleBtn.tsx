import { api } from '../utils/api';

interface Props {
  refetch: () => void;
  requesterId: string;
}

const FriendRequestHandleBtn: React.FC<Props> = ({ refetch, requesterId }) => {
  const utils = api.useContext();

  const acceptMutation = api.friends.acceptFriendRequest.useMutation({
    onSuccess: async () => {
      refetch();
      await utils.friends.invalidate();
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const declineMutation = api.friends.declineFriendRequest.useMutation({
    onSuccess: () => {
      refetch();
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
    <div className="flex items-center space-x-3 px-8">
      <button
        onClick={() => handleAccept(requesterId)}
        className="btn border-none bg-yellow-400 text-white"
      >
        Accept
      </button>
      <button
        onClick={() => handleDecline(requesterId)}
        className="btn border-none bg-pink-900 text-white"
      >
        Decline
      </button>
    </div>
  );
};

export default FriendRequestHandleBtn;
