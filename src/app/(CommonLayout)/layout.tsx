import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar3";


const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
    <Navbar />
      <div className="">{children}</div>
      <Footer/>
    </div>
  );
};

export default RootLayout;