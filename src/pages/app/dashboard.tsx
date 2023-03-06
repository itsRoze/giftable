import AppLayout from '../../components/layouts/mainApp/AppLayout';
import { type NextPageWithLayout } from '../_app';

const Dashboard: NextPageWithLayout = () => {
  return (
    <article className="">
      <div className="">Dashboard</div>
    </article>
  );
};

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const session = await getServerAuthSession(ctx);

//   if (!session) {
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       session,
//     },
//   };
// };

export default Dashboard;

Dashboard.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};
