import { UserCheck, X } from 'lucide-react';
import AppLayout from '~/components/layouts/mainApp/AppLayout';
import { LoadingPage } from '~/components/Loading';
import { Button } from '~/components/ui/button';
import { useToast } from '~/components/ui/use-toast';
import { UserCard } from '~/components/UserCard';
import { api } from '~/utils/api';
import { type NextPageWithLayout } from '../_app';

const NotifcationsPage: NextPageWithLayout = () => {
  const ctx = api.useContext();
  const { toast } = useToast();
  const { data: friendRequests, isLoading } =
    api.friends.getFriendRequests.useQuery();

  const { mutate: acceptMutate } = api.friends.acceptFriendRequest.useMutation({
    onSuccess() {
      void ctx.friends.invalidate();
    },
    onError() {
      toast({
        variant: 'destructive',
        title: 'Uh oh!',
        description: 'Something went wrong. Please try again',
      });
    },
  });

  const { mutate: declineMutate } =
    api.friends.declineFriendRequest.useMutation({
      onSuccess() {
        void ctx.friends.invalidate();
      },
      onError() {
        toast({
          variant: 'destructive',
          title: 'Uh oh!',
          description: 'Something went wrong. Please try again',
        });
      },
    });

  if (isLoading) return <LoadingPage />;
  if (!isLoading && !friendRequests) return <div>404</div>;

  if (friendRequests.length === 0) {
    return (
      <article className="flex h-full flex-col">
        <section className="my-8">
          <h1 className="text-3xl font-medium">Nothing to see here 🌈</h1>
        </section>
      </article>
    );
  }

  return (
    <article className="flex h-full flex-col">
      <section className="my-8 flex justify-center">
        <h1 className="text-3xl font-medium">New Friend Requests</h1>
      </section>
      <section className="my-8"></section>
      <ul className="space-y-8">
        {friendRequests.map((friendReq) => (
          <li key={friendReq.id} className="flex flex-col gap-4">
            <UserCard {...friendReq} />
            <div className="flex gap-2">
              <Button
                size={'sm'}
                className="bg-green-500 hover:bg-green-400"
                onClick={() => acceptMutate({ requesterId: friendReq.id })}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Accept
              </Button>
              <Button
                size={'sm'}
                variant="secondary"
                onClick={() => declineMutate({ requesterId: friendReq.id })}
              >
                <X className="mr-2 h-4 w-4" />
                Decline
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
};

NotifcationsPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default NotifcationsPage;
