import { api } from '../utils/api';

interface Props {
  userId: string;
  refetch: () => void;
}

const CancelRequestBtn: React.FC<Props> = ({ userId, refetch }) => {
  const cancelRequestMutation = api.friends.cancelFriendRequest.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleClick = () => {
    cancelRequestMutation.mutate({ requestedId: userId });
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleClick}
        className="btn-sm btn gap-2 border-none bg-pink-900 text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        Pending
      </button>
    </div>
  );
};

export default CancelRequestBtn;
