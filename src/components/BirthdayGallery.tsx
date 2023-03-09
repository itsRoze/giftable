import { useEffect, useState } from 'react';
import { type BirthdayItem } from '../lib/helpers';
import BirthdayCard from './BirthdayCard';

interface Props {
  items: BirthdayItem[];
}

const BirthdayGallery: React.FC<Props> = ({ items }) => {
  const [cards, setCards] = useState<JSX.Element[]>([]);
  const [slides, setSlides] = useState<JSX.Element[]>([]);

  const createItemCards = () => {
    const tempCards = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i] as BirthdayItem;

      tempCards.push(
        <BirthdayCard
          key={items[i]?.id}
          id={item.id}
          name={item.name}
          birthday={item.birthday}
        />
      );
    }
    setCards(tempCards);
  };

  const createSlides = () => {
    const tempSlides = [];
    for (let i = 0; i < cards.length / 6; i++) {
      tempSlides.push(
        <div
          key={i}
          id={`slide${i}`}
          className="carousel-item flex w-full items-center"
        >
          <div className="grid grid-cols-1 gap-x-12">
            {cards.slice(i * 6, i * 6 + 6).map((card) => card)}
          </div>
          <div className="flex flex-col">
            {i < cards.length / 6 - 1 ? (
              <a
                href={`#slide${i + 1}`}
                className="btn-circle btn ml-5 h-16 w-16 border-2 border-none bg-indigo-100 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="h-10 w-10 text-indigo-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </a>
            ) : null}
            {i > 0 ? (
              <a
                href={`#slide${i - 1}`}
                className="btn-circle btn ml-5 h-16 w-16 border-2 border-none bg-indigo-100 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="h-10 w-10 text-indigo-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
              </a>
            ) : null}
          </div>
        </div>
      );
    }

    setSlides(tempSlides);
  };

  useEffect(() => {
    createItemCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    createSlides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  return <div className="carousel w-full">{slides.map((slide) => slide)}</div>;
};

export default BirthdayGallery;
