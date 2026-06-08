import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Menu, 
  RefreshCcw,
 
} from 'lucide-react';

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
   const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}").value?.user || {};

  return (
    <header className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur border-b border-gray-800">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button onClick={() => {
           
            setIsSidebarOpen(prev=>!prev)

          }}>
            <Menu className="w-8 h-8 text-gray-300 cursor-pointer" />
          </button>
          <span className="font-semibold text-white">Houzer</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <button onClick={() => window.location.reload()}>
            <RefreshCcw className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>

          <div className="relative">
            <div
              onClick={() => setOpen(!open)}
              className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer"
            >
              <span className="text-sm">U</span>
            </div>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                <div className="px-3 py-2 border-b border-gray-800">
                  <p className="text-sm">{user.username || "Guest"}</p>
                </div>

                <button
                  onClick={() => navigate("/user/profile")}
                  className="w-full text-left text-white px-3 py-2 text-sm hover:bg-gray-800"
                >
                  Profile
                </button>

                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate("/");
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-800"
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
};
export default Header;