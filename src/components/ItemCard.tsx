interface Props {
  title: string;
  description: string;
  url: string;
}

const ItemCard: React.FC<Props> = ({ title, description, url }) => {
  return (
    <div className="card-bordered card w-80 border-gray-400 bg-white	">
      <div className="card-body">
        <h2 className="card-title text-pink-400">{title}</h2>
        <p>{description}</p>
        <div className="card-actions justify-end">
          <a
            href={url}
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
