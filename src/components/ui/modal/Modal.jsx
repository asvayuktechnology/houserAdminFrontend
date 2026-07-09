import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "lg",
  closeOnOverlay = true,
}) {
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-6xl",
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnOverlay ? onClose : undefined}
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            transition={{
              duration: 0.25,
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-5"
          >
            <div
              className={`
                w-full
                ${sizes[size]}
                rounded-md
                border
                border-[#2A3052]
                bg-[#171B2E]
                shadow-2xl
                overflow-hidden
              `}
            >
              <div className="flex items-center justify-between border-b border-[#2A3052] px-6 py-5">
                <h2 className="text-xl font-semibold text-white">
                  {title}
                </h2>

                <button
                  onClick={onClose}
                  className="rounded-lg p-2 transition hover:bg-[#232A47] cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto p-6">
                {children}
              </div>

              {footer && (
                <div className="border-t border-[#2A3052] bg-[#14192B] px-6 py-5">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}