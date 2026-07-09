import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const variants = {
    primary:
        "bg-blue-600 hover:bg-blue-500 text-white border border-blue-500",

    secondary:
        "bg-[#232A47] hover:bg-[#2C3560] text-white border border-[#2A3052]",

    danger:
        "bg-red-600 hover:bg-red-500 text-white border border-red-500",

    success:
        "bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500",

    ghost:
        "bg-transparent hover:bg-[#232A47] text-gray-300 border border-transparent",

    outline:
        "bg-transparent border border-[#2A3052] text-gray-300 hover:bg-[#232A47]",
};

const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base",
};

export default function Button({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = "",
    ...props
}) {
    return (
        <motion.button
            whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
            whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
            transition={{ duration: 0.18 }}
            disabled={disabled || loading}
            className={` cursor-pointer
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-md
        font-medium
        transition-all
        duration-200
        disabled:opacity-60
        disabled:cursor-not-allowed
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500/30

        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
            {...props}
        >
            {loading ? (
                <>
                    <Loader2 size={16} className="animate-spin" />
                    Loading...
                </>
            ) : (
                <>
                    {leftIcon}
                    {children}
                    {rightIcon}
                </>
            )}
        </motion.button>
    );
}