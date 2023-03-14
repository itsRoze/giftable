import Link from 'next/link';

const HomeBtn = () => {
  return (
    <Link
      href="/app/dashboard"
      className="btn-circle btn border-none bg-indigo-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="h-8 w-8 text-indigo-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </svg>
    </Link>
  );
};

export default HomeBtn;
