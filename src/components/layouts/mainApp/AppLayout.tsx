import Navbar from './Navbar';

interface IAppLAyout {
  children: React.ReactNode;
}

const AppLayout: React.FC<IAppLAyout> = ({ children }) => {
  return (
    <div className="flex">
      <Navbar />
      <main className="ml-2 flex min-h-screen flex-1 flex-col bg-indigo-50">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
