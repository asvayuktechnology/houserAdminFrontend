import React from "react";
import { motion } from "framer-motion";

function SidebarSection({ title, collapsed }) {
  if (collapsed) {
    return <div className="my-4 border-t border-[#2A3052]" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 pt-6 pb-2"
    >
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-500">
        {title}
      </h4>
    </motion.div>
  );
}

export default React.memo(SidebarSection);