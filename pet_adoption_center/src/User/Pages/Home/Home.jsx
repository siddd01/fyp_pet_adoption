import { Outlet } from "react-router-dom";
import Footer from "../../Components/Footer";
import Navbar from "../../Components/Navbar";

const HomeLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomeLayout;
