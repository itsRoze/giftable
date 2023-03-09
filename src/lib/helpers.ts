import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';

export default function usePush(): NextRouter['push'] {
  const router = useRouter();
  const routerRef = useRef(router);

  routerRef.current = router;

  const [{ push }] = useState<Pick<NextRouter, 'push'>>({
    push: (path) => routerRef.current.push(path),
  });

  return push;
}

export const createFakeItems = (numItems: number): Item[] => {
  const fakeItems = [];
  for (let i = 1; i <= numItems; i++) {
    fakeItems.push({
      id: i,
      name: `Item ${i}`,
      description: `This is item ${i}`,
      url: 'https://www.google.com',
    });
  }

  return fakeItems;
};

export type Item = {
  id: number;
  name: string;
  description: string;
  url: string;
};

export const createFakeBirthdays = (numItems: number): BirthdayItem[] => {
  const fakeItems = [];
  for (let i = 1; i <= numItems; i++) {
    fakeItems.push({
      id: i,
      name: `Marsha`,
      birthday: 'February 25',
    });
  }

  return fakeItems;
};

export type BirthdayItem = {
  id: number;
  name: string;
  birthday: string;
};
