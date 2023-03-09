import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import BirthdayCard from './BirthdayCard';

type CardData = {
  id: number;
  name: string;
  birthday: string;
};

type MultiCardCarouselProps = {
  cards: CardData[];
  visibleCards?: number;
};

const MultiCardCarousel = ({
  cards,
  visibleCards = 3,
}: MultiCardCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselLength = Math.ceil(cards.length / visibleCards);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselLength - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselLength - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full">
      <div
        className="flex transform-gpu space-x-4 overflow-hidden transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 1}%)` }}
      >
        {cards.map((card) => (
          <BirthdayCard
            key={card.id}
            id={card.id}
            birthday={card.birthday}
            name={card.name}
          />
        ))}
      </div>

      {carouselLength > 1 && (
        <>
          <button
            onClick={handlePrevClick}
            className="absolute left-0 top-1/2 -translate-y-1/2 transform text-gray-800 hover:text-gray-900 focus:outline-none"
          >
            <ChevronLeftIcon className="h-6 w-6" />
            <span className="sr-only">Previous</span>
          </button>

          <button
            onClick={handleNextClick}
            className="absolute right-0 top-1/2 -translate-y-1/2 transform text-gray-800 hover:text-gray-900 focus:outline-none"
          >
            <ChevronRightIcon className="h-6 w-6" />
            <span className="sr-only">Next</span>
          </button>
        </>
      )}
    </div>
  );
};

export default MultiCardCarousel;
