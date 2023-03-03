interface IAppLAyout {
  children: React.ReactNode;
}

const AppLayout: React.FC<IAppLAyout> = ({ children }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      {children}
    </main>
  );
};

export default AppLayout;
