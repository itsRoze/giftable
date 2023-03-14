import { useState } from 'react';
import { api } from '../../utils/api';

interface Props {
  userId: string;
  refetch: () => void;
}

const AddGiftIdeaForm: React.FC<Props> = ({ refetch, userId }) => {
  const giftMutation = api.giftIdeas.addGiftForUser.useMutation({
    onSuccess: () => {
      refetch();
      console.log('added gift');
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    giftMutation.mutate({ userId, giftName: name, giftUrl: url });

    setName('');
    setUrl('');
  };

  return (
    <form className="flex w-1/2 items-center" onSubmit={handleSubmit}>
      <div className="grid w-1/2 grid-cols-4 items-center gap-x-1 gap-y-2">
        {/* Name */}
        <label className="font-medium text-indigo-400">Name</label>
        <input
          type="text"
          placeholder="e.g. Raincoat"
          onChange={(e) => setName(e.target.value)}
          className="input-bordered input col-span-3 w-full max-w-xs bg-white"
        />
        {/* Url */}
        <label className="font-medium text-indigo-400">Url</label>
        <input
          type="url"
          placeholder="www.example.com"
          onChange={(e) => setUrl(e.target.value)}
          className="input-bordered input col-span-3 w-full max-w-xs bg-white"
        />
      </div>
      <button
        type="submit"
        className="btn-circle btn ml-10 h-16 w-16 border-indigo-400 bg-indigo-400 hover:border-indigo-300 hover:bg-indigo-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={5.5}
          stroke="currentColor"
          className="h-10 w-10 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
    </form>
  );
};

export default AddGiftIdeaForm;
