// Layout.jsx - Updated with shared state
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";


const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="layout-container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`main-content ${isSidebarOpen ? "" : "shifted"}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;