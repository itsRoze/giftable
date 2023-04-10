import { CogIcon } from '@heroicons/react/24/solid';

const NavSettings: React.FC = () => {
  return (
    <div className="dropdown-top dropdown dropdown-hover w-fit">
      <label tabIndex={0} className="btn-ghost btn-circle btn m-1">
        <CogIcon className="h-10 w-10" />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box w-52 bg-white p-2 shadow"
      >
        <li>
          <button>Sign out</button>
        </li>
      </ul>
    </div>
  );
};

export default NavSettings;
