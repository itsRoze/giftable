import { CheckIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface Props {
  id: number;
}

const Checkbox: React.FC<Props> = ({ id }) => {
  const [isSelected, setIsSelected] = useState(false);
  const [checked, setChecked] = useState(false);
  const [checkHovering, setCheckHovering] = useState(false);

  const handleOnCheck = () => {
    setIsSelected(false);
    setChecked((value) => !value);
  };

  return (
    <fieldset className="z-0">
      <label
        htmlFor={`check-box-${id}`}
        className="pointer-events-none relative flex items-center rounded-full p-2 hover:bg-slate-100"
      >
        <input
          id={`check-box-${id}`}
          type={'checkbox'}
          checked={checked}
          onChange={handleOnCheck}
          onMouseOut={() => setCheckHovering(false)}
          onMouseOver={() => setCheckHovering(true)}
          className="bg-transparent-100 peer pointer-events-auto z-10 cursor-pointer appearance-none rounded-lg border-2 border-transparent p-3"
        />
        <span className="absolute rounded-lg border-2 border-slate-200 p-3 peer-checked:bg-slate-500 "></span>
        <CheckIcon className="absolute left-[0.85rem] h-4 w-4 stroke-yellow-400 stroke-[3] opacity-0 peer-checked:opacity-100 peer-hover:opacity-60 lg:left-3 lg:top-3 lg:h-5 lg:w-5 " />
      </label>
    </fieldset>
  );
};

export default Checkbox;
