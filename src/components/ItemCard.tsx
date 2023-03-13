interface Props {
  title: string;
  url: string;
}

const ItemCard: React.FC<Props> = ({ title, url }) => {
  return (
    <div className="card-bordered card w-72 border-gray-400 bg-white	">
      <div className="card-body">
        <h2 className="card-title text-pink-400">{title}</h2>
        <div className="card-actions ">
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
