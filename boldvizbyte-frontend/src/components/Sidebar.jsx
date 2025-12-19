// Sidebar.jsx - Complete Component
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaBars, FaUser } from "react-icons/fa";
import "../styles/sidebar.css";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <div className="brand">
          <img src="\logo\Logo1.png" className="logo" alt="logo" />
          <h2 className="brand-name">Boldvizbyte</h2>
        </div>

        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>

      <nav className="sidebar-menu">
        <ul>
          <li>
            <NavLink to="/dashboard" className="menu-link">
              <FaHome className="menu-icon" />
              <span className="menu-text">Dashboard</span>
            </NavLink>
            </li>
            <li>
            <NavLink to="/users" className="menu-link">
              <FaHome className="menu-icon" />
              <span className="menu-text">User</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/attendance" className="menu-link">
              <FaHome className="menu-icon" />
              <span className="menu-text">Attendance</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/tasks" className="menu-link">
              <FaHome className="menu-icon" />
              <span className="menu-text">Task</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/projects" className="menu-link">
              <FaHome className="menu-icon" />
              <span className="menu-text">Project</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={() => navigate("/login")}>
          <FaUser className="logout-icon" />
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;