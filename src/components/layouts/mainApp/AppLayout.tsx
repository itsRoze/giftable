import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface IAppLAyout {
  children: React.ReactNode;
}

const AppLayout: React.FC<IAppLAyout> = ({ children }) => {
  return (
    <div className="flex overflow-hidden">
      <Sidebar />
      <main className="ml-2 flex h-screen flex-1 flex-col overflow-y-scroll px-5 pt-4">
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
