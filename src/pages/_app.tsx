import { ClerkProvider } from '@clerk/nextjs';
import { type AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '~/components/ui/toaster';

import { api } from '~/utils/api';

import { type NextPage } from 'next';
import { type ReactElement, type ReactNode } from 'react';
import '~/styles/globals.css';

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({
  Component,
  pageProps: { ...pageProps },
}: AppPropsWithLayout) => {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  const layout = getLayout(<Component {...pageProps} />);

  return (
    <>
      <ClerkProvider {...pageProps}>{layout}</ClerkProvider>
      <Analytics />
      <Toaster />
    </>
  );
};

export default api.withTRPC(MyApp);
