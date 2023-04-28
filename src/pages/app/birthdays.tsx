import AppLayout from '~/components/layouts/mainApp/AppLayout';
import { LoadingPage } from '~/components/Loading';
import { UserCard } from '~/components/UserCard';
import { api } from '~/utils/api';
import { type NextPageWithLayout } from '../_app';

const Birthdays: NextPageWithLayout = () => {
  const { data: friends, isLoading } = api.friends.getBirthdays.useQuery();
  if (isLoading) {
    return (
      <section className="my-8">
        <h1 className="text-center text-5xl font-medium">Upcoming Birthdays</h1>
        <LoadingPage />
      </section>
    );
  }

  if (!isLoading && !friends) return <div>404</div>;

  return (
    <article className="flex h-full flex-col">
      <section className="my-8">
        <h1 className="text-center text-5xl font-medium">Upcoming Birthdays</h1>
      </section>
      <section>
        <ul className="space-y-8">
          {friends.map((friend) => (
            <li key={friend.id}>
              <UserCard
                id={friend.id}
                avatarUrl={friend.avatarUrl}
                name={friend.name}
                pronouns={friend.pronouns}
                birthday={new Date(friend.nextBirthday.toString())}
                showFullBirthday={true}
              />
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};

Birthdays.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};

export default Birthdays;
