import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  id: string;
  avatarUrl: string;
  name: string;
  pronouns: string;
  birthday: Date;
}

export const UserCard: React.FC<Props> = ({
  id,
  avatarUrl,
  name,
  pronouns,
  birthday,
}) => {
  return (
    <Link
      href={`/app/users/${encodeURIComponent(id)}`}
      className="flex w-1/2 items-center gap-2 rounded-lg p-2 hover:bg-slate-100"
    >
      <Image
        src={avatarUrl}
        alt="User Profile Picture"
        width={80}
        height={80}
        className="rounded-full"
      />
      <div className="flex flex-col items-start justify-start">
        <h2 className="text-xl font-medium">{name}</h2>
        <div className="text-gray-600">
          <p>({pronouns})</p>
          <p>🎂 {dayjs(birthday).format('MMM D')}</p>
        </div>
      </div>
    </Link>
  );
};
