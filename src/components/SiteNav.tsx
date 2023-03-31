import { Disclosure } from '@headlessui/react';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { classNames } from '~/lib/helpers';

const navigation = [{ name: 'About', href: '/about', current: false }];

const Navbar = () => {
  const router = useRouter();
  const pathname = router.pathname;

  return (
    <>
      <div className="mb-8 md:mb-16">
        <Disclosure as="nav">
          {({ open }) => (
            <>
              <div className="mx-auto">
                <div className="flex h-16 items-center justify-start">
                  <div className="hidden w-full md:block ">
                    <div className="flex items-center justify-between">
                      <Link href="/" className="">
                        <Image
                          src="/images/logo.svg"
                          alt="Giftable Logo"
                          width={688}
                          height={149}
                          className="w-72"
                        />
                      </Link>
                      <div className="flex items-center space-x-6">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            target={item.name === 'Resume' ? '_blank' : '_self'}
                            className={classNames(
                              'cursor-pointer p-1 text-base font-medium text-black md:text-lg',
                              pathname === item.href
                                ? 'bg-emerald-300 '
                                : 'hover:underline hover:underline-offset-4'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
                          </Link>
                        ))}
                        <Link
                          href="/"
                          className="m-1 rounded-lg bg-sky-900 p-2 text-sm font-medium text-white shadow-md shadow-black hover:bg-sky-800  md:text-base"
                        >
                          Get Started
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="-mr-2 flex items-center md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="mt-2 inline-flex items-center justify-center rounded-md hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                    <Link href="/" className="ml-2">
                      <Image
                        src="/images/logo.svg"
                        alt="Giftable Logo"
                        width={688}
                        height={149}
                        className="w-72"
                      />
                    </Link>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="mb-4 border-b-2 border-stone-600 md:hidden">
                <div className="space-y-1 pt-2 pb-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        'block px-3 py-2 text-base font-extralight text-black md:text-2xl',
                        pathname === item.href
                          ? 'bg-emerald-300 '
                          : 'hover:underline hover:underline-offset-4'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                  <Disclosure.Button>
                    <Link
                      href="/"
                      className="m-1 rounded-lg bg-sky-900 p-2 text-sm font-medium text-white shadow-md shadow-black hover:bg-sky-800  md:text-base"
                    >
                      Get Started
                    </Link>
                  </Disclosure.Button>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
};

export default Navbar;
