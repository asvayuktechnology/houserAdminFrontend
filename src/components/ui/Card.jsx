import { ChevronUp, RefreshCw, X } from "lucide-react";

function Card({
    title = false,
    children,
    className = "",
    padding = "p-5",
    headerActions,
    showHeader = false,
    showDivider = true,
}) {
    return (
        <div
            className={` relative
        overflow-hidden
        rounded-md
        border
        border-[#2A3052]
        bg-[#171B2E]
        shadow-[0_8px_35px_rgba(0,0,0,0.18)]
        transition-all
        duration-300
        hover:border-blue-600/30
        ${className}
      `}
        >
            {title && (
                <>
                    <div className="flex items-center justify-between px-5 py-5">
                        <div>
                            {title && (
                                <h2 className="text-sm font-semibold text-white">
                                    {title}
                                </h2>
                            )}

                      
                        </div>

                   
                    </div>

                    {showDivider && (
                        <div className="border-b border-[#2A3052]" />
                    )}
                </>
            )}

            <div className={padding}>
                {children}
            </div>
        </div>
    );
}

export default Card;