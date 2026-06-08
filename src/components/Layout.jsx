import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { AuthProvider } from "../context/AuthContext";




const Layout = ({ isSidebarOpen, setisSidebarOpen }) => {

  return (
    <div>
      {/* ✅ Toaster */}
      <Toaster position="top-center" />


      <div>
        
        {
isSidebarOpen == true && (
 <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setisSidebarOpen}
          />
)
         
        }
       
 

        <div>
          <Header
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setisSidebarOpen}
          />

          <div
            style={{ width: "100%" }}
            onClick={() => setisSidebarOpen(false)}
          >
            
            <Outlet />
         
             
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;