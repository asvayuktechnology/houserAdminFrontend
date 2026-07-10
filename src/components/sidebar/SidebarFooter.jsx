import React, { useState } from "react";
import { motion } from "framer-motion";
import { LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../ui/modal/ConfirmModal";

function SidebarFooter({
  collapsed,
  handleLogout,
}) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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
        onClick={() => setShowLogoutModal(true)}
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

      <ConfirmModal
        open={showLogoutModal}
        title="Logout"
        description="Are you sure you want to logout from your account?"
        confirmText="Logout"
        loading={false}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          handleLogout();
        }}
      />
    </div>
  );
}

export default React.memo(SidebarFooter);