import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Moon,
  Bell,
  Settings,
  Maximize2,
  LayoutGrid,
  ChevronDown,
  RefreshCcw,
  LogOut,
} from "lucide-react";

export default function Header({
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const user =
    JSON.parse(localStorage.getItem("user") || "{}")
      ?.value?.user || {};

  const IconButton = ({ children, badge }) => (
    <button className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition hover:bg-[#232A47] hover:text-white">
      {children}

      {badge && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
          {badge}
        </span>
      )}
    </button>
  );

  return (
    // <header className="fixed top-0 left-0 right-0 z-40 h-[72px] border-b border-[#2A3052] bg-[#171B2E]/95 backdrop-blur-xl">
    <header className="fixed top-0 left-0 right-0 z-40 h-[72px] border-b border-[#2A3052] bg-[#171B2E]/0 backdrop-blur-xl">

      <div className="flex h-full items-center justify-between px-8">

        {/* LEFT */}

        <div className="flex items-center gap-6">

          <button
            onClick={() =>
              setIsSidebarOpen((prev) => !prev)
            }
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#2A3052] bg-[#1F2440] transition hover:border-blue-600 hover:bg-[#252B48]"
          >
            <Menu size={22} className="text-gray-400" />
          </button>

          <div>
            <h1 className="text-lg font-semibold text-white">
              Houzer
            </h1>

            <p className="text-xs text-gray-400">
              Admin Dashboard
            </p>
          </div>
        </div>

        {/* SEARCH */}

        {/* <div className="hidden w-[420px] xl:block">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              placeholder="Quick Search..."
              className="
                h-11
                w-full
                rounded-full
                border
                border-[#2A3052]
                bg-[#232A47]
                pl-11
                pr-4
                text-sm
                text-white
                placeholder:text-gray-500
                outline-none
                transition
                focus:border-blue-600
              "
            />

          </div>

        </div> */}

        {/* RIGHT */}

        <div className="flex items-center gap-1">

         

          {/* <IconButton>
            <Settings size={18} />
          </IconButton>

          <IconButton>
            <LogOut size={18} />
          </IconButton> */}

          <div className="mx-4 h-8 w-px bg-[#2A3052]" />

          {/* USER */}

          <div className="relative">

            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-[#232A47]"
            >
              <img
                src="/houserdemologo.png"
                alt=""
                className="h-10 w-10 rounded-full object-cover cursor-pointer"
              />

              <div className="hidden text-left lg:block cursor-ponter">

                <p className="text-sm font-semibold text-white cursor-pointer">
                  {user.username || "Administrator"}
                </p>

                <p className="text-xs text-gray-400 cursor-pointer">
                  Admin
                </p>

              </div>

              <ChevronDown
                size={16}
                className="text-gray-500"
              />
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-md border border-[#2A3052] bg-[#171B2E] shadow-2xl">

                <button
                  onClick={() =>
                    navigate("/admin/profile")
                  }
                  className="w-full px-5 py-3 text-left text-sm text-gray-300 transition hover:bg-[#232A47] cursor-pointer"
                >
                  Profile
                </button>

                <button
                  onClick={() =>
                    navigate("/admin/settings")
                  }
                  className="w-full px-5 py-3 text-left text-sm text-gray-300 transition hover:bg-[#232A47] cursor-pointer"
                >
                  Settings
                </button>

                <div className="border-t border-[#2A3052]" />

                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate("/");
                  }}
                  className="w-full px-5 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10 cursor-pointer"
                >
                  Logout
                </button>

              </div>
            )}

          </div>

        </div>

      </div>

    </header>
  );
}