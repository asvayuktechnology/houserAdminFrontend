import React from "react";
import { motion } from "framer-motion";
import { UserCircle2 } from "lucide-react";

function SidebarProfile({ collapsed }) {
  if (collapsed) {
    return (
      <div className="flex justify-center py-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#252B48]"
        >
          <UserCircle2 className="h-7 w-7 text-white" />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mt-5 overflow-hidden rounded-2xl bg-[#202540] shadow-lg"
    >
      {/* Decorative Header */}
      <div className="relative h-20 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.2),transparent_45%)]" />
      </div>

      {/* Profile */}
      <div className="-mt-8 px-5 pb-5">
        <div className="relative w-fit">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#202540] bg-[#2B3155]">
            <UserCircle2 className="h-10 w-10 text-white" />
          </div>

          {/* Online Indicator */}
          <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-[#202540] bg-emerald-400" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-white">
          Admin
        </h3>

        <p className="mt-1 text-sm text-gray-400">
          Super Administrator
        </p>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#2B3155] p-3 text-center">
            <p className="text-lg font-bold text-white">24</p>
            <p className="text-xs text-gray-400">Projects</p>
          </div>

          <div className="rounded-xl bg-[#2B3155] p-3 text-center">
            <p className="text-lg font-bold text-white">99%</p>
            <p className="text-xs text-gray-400">Activity</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default React.memo(SidebarProfile);