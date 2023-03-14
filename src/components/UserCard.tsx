import { type User } from '@prisma/client';
import moment from 'moment';
import Link from 'next/link';

interface Props {
  user: User;
}

const UserCard: React.FC<Props> = ({ user }) => {
  return (
    <div className="card w-full bg-transparent text-gray-600">
      <div className="card-body">
        <div className="flex items-center">
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            className="h-32 w-32"
          >
            <rect width="100%" height="100%" fill="#9792e3" />
            <circle cx="30" cy="30" r="4" fill="black" />
            <circle cx="70" cy="30" r="4" fill="black" />
            <path
              d="M 30 50 Q 50 60 70 50"
              stroke="black"
              strokeWidth="5"
              fill="none"
            />
          </svg>
          <div className="ml-5 flex-grow">
            <div className="mb-2">
              <h2 className="card-title text-gray-600">{user.name}</h2>
              <p className="py-1">({user.pronouns})</p>
              <p className="py-1">
                🎂 {moment(user.birthday).format('MMMM, DD')}
              </p>
            </div>

            <Link
              href={`/app/users/${encodeURIComponent(user.id)}`}
              className="pt-10 text-lg underline"
            >
              Visit Profile ↗️
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
