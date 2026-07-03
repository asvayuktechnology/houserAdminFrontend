import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

function SidebarMenuItem({
  item,
  activeMenu,
  handleMenuClick,
  collapsed,
  openMenu,
  handleDropdownToggle,
}) {
  const location = useLocation();

  const Icon = item.icon;

  const hasChildren = item.children && item.children.length > 0;

  const isOpen = openMenu === item.id;

  const isParentActive =
    hasChildren &&
    item.children.some((child) => child.path === location.pathname);

  const isActive =
    activeMenu === item.id ||
    location.pathname === item.path ||
    isParentActive;

  const dropdownVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 24,
        staggerChildren: 0.05,
        delayChildren: 0.03,
      },
    },
  };

  const childVariants = {
    closed: {
      opacity: 0,
      x: -8,
    },
    open: {
      opacity: 1,
      x: 0,
    },
  };

  return (
    <motion.div layout className="relative">
      {/* ACTIVE BAR */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-2 h-8 w-1 rounded-r-full bg-blue-600"
        />
      )}

      {/* Parent */}
      {hasChildren ? (
        <motion.button
          layout
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleDropdownToggle(item.id)}
          className={`mx-3 flex h-12 w-[calc(100%-24px)] items-center rounded-xl px-4 transition-all duration-200 ${
            isActive
              ? "bg-[#252B48] text-white"
              : "text-gray-400 hover:bg-[#202540] hover:text-white"
          }`}
        >
          <Icon
            size={20}
            className={`${collapsed ? "mx-auto" : "mr-3"} flex-shrink-0`}
          />

          {!collapsed && (
            <>
              <span className="flex-1 text-start text-md text-white/80 font-medium">
                {item.title}
              </span>

              <motion.div
                animate={{
                  rotate: isOpen ? 90 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <ChevronRight size={16} />
              </motion.div>
            </>
          )}
        </motion.button>
      ) : (
        <motion.div layout whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
          <Link
            to={item.path}
            onClick={() => handleMenuClick(item.id)}
            className={`mx-3 flex h-12 items-center rounded-xl px-4 transition-all duration-200 ${
              isActive
                ? "bg-[#252B48] text-white"
                : "text-gray-400 hover:bg-[#202540] hover:text-white"
            }`}
          >
            <Icon
              size={20}
              className={`${collapsed ? "mx-auto" : "mr-3"} flex-shrink-0`}
            />

            {!collapsed && (
              <>
                <span className="flex-1 text-start text-md text-white/80 font-medium">
                  {item.title}
                </span>

                {item.badge && (
                  <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
        </motion.div>
      )}

      {/* SUBMENU */}
      {!collapsed && hasChildren && (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              layout
              variants={dropdownVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="overflow-hidden"
            >
              <div className="ml-8 mt-2 border-l border-[#2A3052] pl-4">
                {item.children.map((child) => {
                  const active = location.pathname === child.path;

                  return (
                    <motion.div
                      key={child.id}
                      variants={childVariants}
                    >
                      <Link
                        to={child.path}
                        onClick={() => handleMenuClick(child.id)}
                        className={`my-1 flex h-10 items-center rounded-lg px-3 text-sm transition-all ${
                          active
                            ? "bg-blue-600/10 text-white border-l-2 border-blue-600"
                            : "text-gray-400 hover:bg-[#232A47] hover:text-white"
                        }`}
                      >
                        {child.title}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

export default React.memo(SidebarMenuItem);