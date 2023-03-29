import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { type z } from 'zod';
import { wishlistItemSchema } from '~/lib/schemas/wishlistItemSchema';
import { api } from '../../utils/api';

type Inputs = z.infer<typeof wishlistItemSchema>;
interface Props {
  refetch: () => void;
}

const NewItemForm: React.FC<Props> = ({ refetch }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<Inputs>({
    defaultValues: {
      name: '',
      url: undefined,
    },
    resolver: zodResolver(wishlistItemSchema),
  });

  const { mutate, isLoading } = api.wishlist.createItem.useMutation({
    onSuccess: () => {
      refetch();
      reset();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log('SUBMITED');
    mutate({ name: data.name, url: data.url });
  };

  useEffect(() => {
    console.log(errors);
    console.log(isValid);
  }, [errors, isValid]);

  return (
    <form className="flex items-center" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-y-2">
        {/* Name */}
        <div className="flex items-center">
          <label className="w-16 font-medium text-indigo-400">Name</label>
          <input
            {...register('name', {
              required: true,
              pattern: {
                value: /^[^\s]+(\s+[^\s]+)*$/,
                message: 'Name should not be empty',
              },
            })}
            aria-invalid={errors.name ? 'true' : 'false'}
            placeholder="e.g. Raincoat"
            className="input-bordered input w-full max-w-xs bg-white"
          />
        </div>
        {/* Url */}
        <div className="flex items-center">
          <label className="w-16 font-medium text-indigo-400">Url</label>
          <input
            {...(register('url'), { required: false })}
            type="url"
            placeholder="www.example.com"
            className="input-bordered input w-full max-w-xs bg-white"
          />
        </div>
        {errors.url && (
          <p className="mb-2 text-left text-red-400" role="alert">
            {errors.url.message}
          </p>
        )}
      </div>
      <button
        disabled={isLoading || !isValid}
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

export default NewItemForm;
