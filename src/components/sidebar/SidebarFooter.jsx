import React from "react";
import { motion } from "framer-motion";
import { LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SidebarFooter({
  collapsed,
  handleLogout,
}) {
  const navigate = useNavigate();
  return (
    <div className="border-t border-[#2A3052] bg-[#171B2E] p-3">
      {/* Settings */}
      <motion.button
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/admin/settings")}
        className={`
          mb-2
          flex
          h-12
          w-full
          items-center
          rounded-xl
          px-4
          text-gray-400
          transition-all
          hover:bg-[#232A47]
          hover:text-white
          ${collapsed ? "justify-center px-0" : ""}
        `}
      >
        <Settings size={20} />

        {!collapsed && (
          <span className="ml-3 text-sm font-medium">
            Settings
          </span>
        )}
      </motion.button>

      {/* Logout */}
      <motion.button
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogout}
        className={`
          flex
          h-12
          w-full
          items-center
          rounded-xl
          px-4
          text-red-400
          transition-all
          hover:bg-red-500/10
          hover:text-red-300
          ${collapsed ? "justify-center px-0" : ""}
        `}
      >
        <LogOut size={20} />

        {!collapsed && (
          <span className="ml-3 text-sm font-medium cursor-pointer">
            Logout
          </span>
        )}
      </motion.button>
    </div>
  );
}

export default React.memo(SidebarFooter);