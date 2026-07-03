// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   Home, 
//   Gift, 
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
//   Trophy,
//   Activity,
//   HelpCircle,
//   Wallet,
//   SendToBack,
//   FolderKey,
//   Calculator,
//   Handshake,
//   House,
//   Pickaxe,
//   LucideHouse,
//   User,
//   HouseHeart,
//   User2Icon
// } from 'lucide-react';

// function SideBar({ isSidebarOpen=true, setIsSidebarOpen }) {
//   const [activeMenu, setActiveMenu] = useState("games");
//   const [isMobile, setIsMobile] = useState(false);
//   const [collapsed, setCollapsed] = useState(false);
//   const sidebarRef = useRef(null);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.clear();
//     setTimeout(() => {
//       window.location.replace("/");
//     }, 100);
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const toggleCollapse = () => {
//     setCollapsed(!collapsed);
//   };

//   const handleMenuClick = (menu) => {
//     setActiveMenu(menu);
//     localStorage.setItem("activeMenu", menu);
//     if (isMobile) setIsSidebarOpen(false);
//   };

//   useEffect(() => {
//     const savedActiveMenu = localStorage.getItem("activeMenu");
//     if (savedActiveMenu) setActiveMenu(savedActiveMenu);

//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     handleResize();
//     window.addEventListener("resize", handleResize);

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const menuItems = [
//     // { id: "home", title: "Home", icon: <Home className="w-5 h-5" />, path: "/user/home" , status:0 },
//     { id: "home", title: "Home", icon: <HouseHeart className="w-5 h-5" />, path: "/admin/dashboard" , status:0 },
//     { id: "challenges", title: "Dealers", icon: <User2Icon className="w-5 h-5" />, path: "/admin/dealers", highlight: true, status:0 },
//     { id: "referral", title: "Add Banner", icon: <Pickaxe className="w-5 h-5" />, path: "/admin/add-banner" , status:0 },
//     { id: "rewards", title: "Properties", icon: <House className="w-5 h-5" />, path: "/admin/properties" , status:0 },
//     { id: "post-properties", title: "Post Properties", icon: <House className="w-5 h-5" />, path: "/admin/post-properties" , status:0 },
//     { id: "plans", title: "Fixed Properties", icon: <LucideHouse className="w-5 h-5" />, path: "/admin/properties" , status:0 },
//     { id: "add-user", title: " Add User", icon: <User className="w-5 h-5" />, path: "/admin/add-user" , status:0 },
//     { id: "add-dealer", title: " Add Dealer", icon: <User className="w-5 h-5" />, path: "/admin/add-dealer" , status:0 },

//   ];

//   return (
//     <>
//       <AnimatePresence>
//         {isSidebarOpen && isMobile && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
//             onClick={toggleSidebar}
//           />
//         )}
//       </AnimatePresence>

//       <motion.aside
//         ref={sidebarRef}
//         initial={{ x: isMobile ? "-100%" : 0 }}
//         animate={{ 
//           x: isSidebarOpen ? 0 : isMobile ? "-100%" : 0,
//           width: collapsed ? "80px" : "260px"
//         }}
//         transition={{ type: "spring", stiffness: 260, damping: 25 }}
//         className={`fixed z-50 h-screen
//           ${isSidebarOpen ? "left-0" : "-left-full md:left-0"}
//           bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950
//           border-r border-gray-800 shadow-2xl`}
//       >
//         <div className="h-full flex flex-col overflow-hidden">

//           {/* Menu */}
//           <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1 mt-14">
//             {menuItems.map((item) => (
//               item?.status==0 && (
//                 <motion.div key={item.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
//                   {item.path ? (
//                     <Link
//                       to={item.path}
//                       onClick={() => handleMenuClick(item.id)}
//                       className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${
//                         activeMenu === item.id
//                           ? "bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-white"
//                           : "text-gray-400 hover:bg-gray-800 hover:text-white"
//                       } ${item.highlight ? "ring-1 ring-cyan-400/40" : ""}`}
//                     >
//                       <span className={`${collapsed ? "mx-auto" : ""}`}>
//                         {item.icon}
//                       </span>

//                       {!collapsed && (
//                         <div className="flex items-center justify-between w-full">
//                           <span className="font-medium">{item.title}</span>
//                           {item.highlight && (
//                             <span className="text-xs px-2 py-0.5 rounded bg-cyan-500 text-black">
//                               New
//                             </span>
//                           )}
//                         </div>
//                       )}
//                     </Link>
//                   ) : (
//                     <button
//                       onClick={item.action}
//                       className={`flex items-center w-full p-3 rounded-xl transition-all text-gray-400 hover:bg-red-500/10 hover:text-red-400 ${collapsed ? "justify-center" : ""}`}
//                     >
//                       <span className={`${collapsed ? "mx-auto" : "mr-3"}`}>
//                         {item.icon}
//                       </span>
//                       {!collapsed && <span>{item.title}</span>}
//                     </button>
//                   )}
//                 </motion.div>
//               )
//             ))}
//           </div>

//         </div>
//       </motion.aside>
//     </>
//   );
// }

// export default React.memo(SideBar);

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarLogo from "./sidebar/SidebarLogo";
import SidebarProfile from "./sidebar/SidebarProfile";
import SidebarSection from "./sidebar/SidebarSection";
import SidebarMenuItem from "./sidebar/SidebarMenuItem";
import SidebarFooter from "./sidebar/SidebarFooter";
import { menuSections } from "./sidebar/menuData";
import { useLocation } from "react-router-dom";
import { House, HouseHeart, LucideHouse, Pickaxe, User, User2Icon } from "lucide-react";



function Sidebar({
  isSidebarOpen = true,
  setIsSidebarOpen,
}) {
  const [activeMenu, setActiveMenu] = useState("home");
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("activeMenu");

    if (saved) {
      setActiveMenu(saved);
      menuSections.forEach((section) => {
        section.items.forEach((item) => {
          if (!item.children) return;

          const matched = item.children.find(
            (child) => child.path === location.pathname
          );

          if (matched) {
            setOpenMenu(item.id);
            setActiveMenu(matched.id);
          }
        });
      });
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  // const handleMenuClick = (menu) => {
  //   setActiveMenu(menu);
  //   localStorage.setItem("activeMenu", menu);

  //   if (isMobile) {
  //     setIsSidebarOpen(false);
  //   }
  // };
const handleDropdownToggle = (menuId) => {
  setOpenMenu((prev) => (prev === menuId ? null : menuId));
};

  const handleLogout = () => {
    localStorage.clear();

    setTimeout(() => {
      window.location.replace("/");
    }, 100);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    localStorage.setItem("activeMenu", menu);
    if (isMobile) setIsSidebarOpen(false);
  };

  useEffect(() => {
    const savedActiveMenu = localStorage.getItem("activeMenu");
    if (savedActiveMenu) setActiveMenu(savedActiveMenu);
    
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const menuItems = [
  //   // { id: "home", title: "Home", icon: <Home className="w-5 h-5" />, path: "/user/home" , status:0 },
  //   { id: "home", title: "Home", icon: <HouseHeart className="w-5 h-5" />, path: "/admin/dashboard" , status:0 },
  //   { id: "challenges", title: "Dealers", icon: <User2Icon className="w-5 h-5" />, path: "/admin/dealers", highlight: true, status:0 },
  //   { id: "referral", title: "Add Banner", icon: <Pickaxe className="w-5 h-5" />, path: "/admin/add-banner" , status:0 },
  //   { id: "rewards", title: " Lead Properties", icon: <House className="w-5 h-5" />, path: "/admin/lead-properties" , status:0 },
  //   { id: "post-properties", title: "Post Properties", icon: <House className="w-5 h-5" />, path: "/admin/post-properties" , status:0 },
  //   { id: "plans", title: "Fixed Properties", icon: <LucideHouse className="w-5 h-5" />, path: "/admin/properties" , status:0 },
  //   { id: "add-user", title: " Add User", icon: <User className="w-5 h-5" />, path: "/admin/add-user" , status:0 },
  //   { id: "add-dealer", title: " Add Dealer", icon: <User className="w-5 h-5" />, path: "/admin/add-dealer" , status:0 },
   
  // ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="relative inset-0 z-999 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{
          x: isSidebarOpen ? 0 : isMobile ? "-100%" : 0,
          width: collapsed ? 80 : 270,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 24,
        }}
        className="fixed left-0 top-0 z-999 flex h-screen flex-col border-r border-[#2A3052] bg-[#171B2E]"
      >
        {/* Logo */}
        <SidebarLogo collapsed={collapsed} />

        {/* Profile */}
        {/* <SidebarProfile collapsed={collapsed} /> */}

        {/* Menu */}
        <div className="sidebar flex-1 overflow-y-auto py-3">
          {menuSections.map((section) => (
            <div key={section.title}>
              <SidebarSection
                title={section.title}
                collapsed={collapsed}
              />

              {section.items.map((item) => (
                <SidebarMenuItem
                  key={item.id}
                  item={item}
                  collapsed={collapsed}
                  activeMenu={activeMenu}
                  handleMenuClick={handleMenuClick}
                  openMenu={openMenu}
                  handleDropdownToggle={handleDropdownToggle}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <SidebarFooter
          collapsed={collapsed}
          handleLogout={handleLogout}
        />

        {/* Collapse Button (Desktop Only) */}
        {!isMobile && (
          <button
            onClick={() => {
              setCollapsed(prev => !prev);
              setIsSidebarOpen(prev => !prev);
            }}

            className="absolute -right-5 top-8 flex h-8 w-8 items-center justify-center rounded-full border border-[#2A3052] bg-[#232A47] text-white shadow-lg transition hover:scale-110"
          >
            {collapsed ? "›" : "‹"}
          </button>
        )}
      </motion.aside>
    </>
  );
}

export default React.memo(Sidebar);