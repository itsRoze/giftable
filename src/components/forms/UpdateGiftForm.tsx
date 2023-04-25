import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import type { GiftIdea } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { type z } from 'zod';
import { updateGiftIdeaSchema } from '~/lib/schemas/updateGiftIdeaSchema';
import { api } from '~/utils/api';

type Inputs = z.infer<typeof updateGiftIdeaSchema>;

const UpdateGiftForm = ({
  giftIdea,
  open,
  setOpen,
}: {
  giftIdea: GiftIdea;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();
  const ctx = api.useContext();
  const { mutate, isLoading } = api.gift.update.useMutation({
    onSuccess(data) {
      reset();
      setOpen(false);

      if (data) {
        toast({
          title: 'Updated!',
          description: `${data?.name} has been updated`,
        });
      }
      void ctx.user.invalidate();
    },
    onError(error) {
      console.log(error.message);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Please try again',
      });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(updateGiftIdeaSchema),
    defaultValues: {
      id: giftIdea.id,
      name: giftIdea.name,
      description: giftIdea.description ?? '',
      url: giftIdea.url ?? '',
      imageUrl: giftIdea.imageUrl ?? '',
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutate({ ...data, id: giftIdea.id });
  };

  const onChange = (isOpen: boolean) => {
    setOpen(isOpen);
    reset();
  };

  console.log(errors);
  console.log(giftIdea);

  return (
    <Dialog open={open} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-2">Edit Gift Idea</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('id')}
            type="number"
            className="hidden"
            value={giftIdea.id}
          />
          {/* Name*/}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">* Name</Label>
            <Input
              {...register('name', {
                pattern: {
                  value: /^[^\s]+(\s+[^\s]+)*$/,
                  message: 'Name should not be empty',
                },
              })}
              aria-invalid={errors.name ? 'true' : 'false'}
              required
              type={'text'}
              id="name"
              placeholder={giftIdea.name}
            />
            {errors.name && (
              <p className="text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>
          {/* Description */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Input
              {...register('description')}
              aria-invalid={errors.description ? 'true' : 'false'}
              type={'text'}
              id="description"
              placeholder={
                giftIdea.description ??
                'e.g. A shiny, waterproof, long coat with a hoodie'
              }
            />
            {errors.description && (
              <p className="text-sm text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>
          {/* Item URL */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="item-url">Item Website</Label>
            <Input
              {...register('url')}
              aria-invalid={errors.url ? 'true' : 'false'}
              type={'url'}
              id="item-url"
              placeholder={giftIdea.url ?? 'https://'}
            />
            {errors.url && (
              <p className="text-sm text-red-400">{errors.url.message}</p>
            )}
          </div>
          {/* Photo URL */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="photo-url">Photo Url</Label>
            <Input
              {...register('imageUrl')}
              aria-invalid={errors.imageUrl ? 'true' : 'false'}
              type={'url'}
              id="photo-url"
              placeholder={giftIdea.imageUrl ?? 'https://'}
            />
            {errors.imageUrl && (
              <p className="text-sm text-red-400">{errors.imageUrl.message}</p>
            )}
          </div>
          {/* Submit */}
          <Button disabled={isSubmitting || isLoading} type="submit">
            {(isSubmitting || isLoading) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateGiftForm;
