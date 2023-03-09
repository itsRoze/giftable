import Link from 'next/link';
import { BirthdayItem } from '../lib/helpers';
import Checkbox from './Checkbox';

const BirthdayCard: React.FC<BirthdayItem> = ({ id, birthday, name }) => {
  return (
    <div className="card-compact card-bordered card w-60 border-gray-400 bg-white">
      <div className="card-body">
        <div className="flex items-start">
          <svg width="50" height="50" viewBox="0 0 100 100">
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
            <p>🎂 {birthday}</p>
          </div>
        </div>
        <Link href="#" className="underline">
          View Wishlist ↗️
        </Link>
        <div className="flex items-center">
          <p className="flex-grow-0">Gift Bought?</p>
          <Checkbox id={1} />
        </div>
      </div>
    </div>
  );
};

export default BirthdayCard;
