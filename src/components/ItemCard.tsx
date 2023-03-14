import { type GiftIdea, type WishlistItem } from '@prisma/client';

interface Props {
  item: WishlistItem | GiftIdea;
}

const ItemCard: React.FC<Props> = ({ item }) => {
  return (
    <div className="card-bordered card w-72 border-gray-400 bg-white	">
      <div className="card-body">
        <h2 className="card-title block truncate text-pink-400">{item.name}</h2>
        <div className="card-actions ">
          <a
            href={item.url}
            target="_blank"
            className="btn border-none bg-blue-300 text-white"
            rel="noreferrer"
          >
            Visit
          </a>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
