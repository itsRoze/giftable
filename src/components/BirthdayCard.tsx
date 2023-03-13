import moment from 'moment';
import Link from 'next/link';
import { type BirthdayItem } from '../lib/helpers';

const BirthdayCard: React.FC<BirthdayItem> = ({ id, birthday, name }) => {
  return (
    <div className="card-bordered card card-compact w-80 border-gray-400 bg-white">
      <div className="card-body">
        <div className="flex items-start">
          <svg
            width="50"
            height="50"
            viewBox="0 0 100 100"
            className="h-12 w-12"
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
          <div className="ml-5">
            <h2 className="card-title text-2xl font-normal text-gray-600">
              {name}
            </h2>
            <p>🎂 {moment(birthday).format('MMMM, DD')}</p>
          </div>
        </div>
        <Link
          href={`/app/users/${encodeURIComponent(id)}`}
          className="underline"
        >
          View Wishlist ↗️
        </Link>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Gift bought?</span>
            <input
              type="checkbox"
              className="checkbox-primary checkbox border-2 border-gray-300"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default BirthdayCard;
