import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { AuthProvider } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useState } from "react";



const Layout = () => {
  const [isSidebarOpen, setisSidebarOpen] = useState(true);
  console.log("Sidebar Open:", isSidebarOpen);
  return (
    <div>
      {/* ✅ Toaster */}
      <Toaster position="top-center" />


      <div className="flex  min-h-screen">

        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setisSidebarOpen}
        />



        <div
          animate={{
            marginLeft: isSidebarOpen ? 270 : 80,
          }}
          // transition={{
          //   type: "spring",
          //   stiffness: 220,
          //   damping: 28,
          // }}
          className={`min-h-screen bg-[#0F1324] w-full p-6 transition-all duration-100 ml-auto ${isSidebarOpen ? "main-content-collapsed max-w-[calc(100%-260px)] ml-auto" : "max-w-[calc(100%-80px)] w-full ml-[80px] main-content-full"}`}
        >
          <Header
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setisSidebarOpen}
          />

          <div
            style={{ width: "100%" }}


          >

            <Outlet />


          </div>
        </div>
      </div>
    </div >
  );
};

export default Layout;