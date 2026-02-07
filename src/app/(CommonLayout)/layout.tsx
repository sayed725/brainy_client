import Navbar from "@/components/shared/Navbar3";


const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">{children}</div>
    </div>
  );
};

export default RootLayout;