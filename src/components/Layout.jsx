import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState, useEffect } from "react";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;

      setIsMobile(mobile);

      // Sidebar default state
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        backgroundImage: 'url("/globe-bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Toaster position="top-center" />

      <div className="flex min-h-screen">

        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Main Content */}
        <div
          className={`
            min-h-screen
            transition-all
            duration-300
            ease-in-out
            ${!isMobile
              ? isSidebarOpen ? "main-content-collapsed max-w-[calc(100%-260px)] ml-[270px] w-full" : "max-w-[calc(100%-80px)] w-full ml-[80px] main-content-full"
              : "w-full ml-0"
            }
          `}
        >
          <Header
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />

          {/* Header Height = 72px */}
          <div className="pt-[72px] w-full" style={{ width: "100%" }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;