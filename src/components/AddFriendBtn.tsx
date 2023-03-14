import { PlusIcon } from '@heroicons/react/24/solid';
import { api } from '../utils/api';

interface Props {
  userId: string;
  refetch: () => void;
}

const AddFriendBtn: React.FC<Props> = ({ userId, refetch }) => {
  const friendRequestMutation = api.friends.sendFriendRequest.useMutation({
    onSuccess: () => {
      void refetch();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleClick = () => {
    friendRequestMutation.mutate({ requestedId: userId });
  };

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={handleClick}
        className="btn-sm btn-circle btn border-none bg-yellow-400 hover:bg-yellow-500"
      >
        <PlusIcon className="h-6 w-6  text-white" />
      </button>
      <p className="px-2 text-xl text-gray-600">Add Friend</p>
    </div>
  );
};

export default AddFriendBtn;
