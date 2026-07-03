import React from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

function SidebarLogo({ collapsed }) {
  return (
    <div className="sticky top-0 z-20 border-b border-[#2A3052] bg-[#171B2E]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex h-20 items-center ${
          collapsed ? "justify-center" : "justify-start px-6"
        }`}
      >
        {/* Logo */}
        {/* <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/20">
          <Building2 size={24} className="text-white" />
        </div> */}
        <img src="/houserdemologo.png" alt="Logo" className=" h-12 w-12" />

        {!collapsed && (
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="ml-4"
          >
            <h2 className="text-xl font-bold tracking-wide text-white">
              Houzer
            </h2>

            <p className="text-xs tracking-[0.25em] uppercase text-gray-400">
              Admin Panel
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default React.memo(SidebarLogo);