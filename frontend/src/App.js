import { createContext, useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes, Link, useLocation } from "react-router-dom";
import "./App.css";
import "./modern-styles.css";
import "./modern-ui.js";
import AdminHome from "./modules/admin/AdminHome";
import ForgotPassword from "./modules/common/ForgotPassword";
import Home from "./modules/common/Home";
import Login from "./modules/common/Login";
import Register from "./modules/common/Register";
import Properties from "./modules/common/Properties";
import OwnerHome from "./modules/user/Owner/OwnerHome";
import RenterHome from "./modules/user/renter/RenterHome";
import Contact from "./modules/common/Contact";

export const UserContext = createContext();

function App() {
  const date = new Date().getFullYear();
  const [userData, setUserData] = useState();
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Function to check if current path is an auth page
  const isAuthPage = (pathname) => {
    return ['/login', '/register', '/forgotpassword'].includes(pathname);
  };

  const getData = async () => {
    try {
      const user = await JSON.parse(localStorage.getItem("user"));
      if (user && user !== undefined) {
        setUserData(user);
        setUserLoggedIn(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserData(null);
    setUserLoggedIn(false);
    window.location.href = "/";
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/properties", label: "Properties", hideOnOwnerDashboard: true },
    { path: "/contact", label: "Contact" },
    { path: "/register", label: "Register", hideWhenLoggedIn: true, hideOnAuth: true, className: "register-button" },
    { path: "/login", label: "Login", hideWhenLoggedIn: true, hideOnAuth: true, className: "login-button" }
  ];

  return (
    <UserContext.Provider value={{ userData, userLoggedIn }}>
      <div className="App">
        <Router>
          <AppContent 
            navLinks={navLinks} 
            userLoggedIn={userLoggedIn} 
            userData={userData} 
            menuOpen={menuOpen} 
            setMenuOpen={setMenuOpen} 
            handleLogOut={handleLogOut}
            date={date}
            isAuthPage={isAuthPage}
          />
        </Router>
      </div>
    </UserContext.Provider>
  );
}

// Separate component to use useLocation hook
function AppContent({ navLinks, userLoggedIn, userData, menuOpen, setMenuOpen, handleLogOut, date, isAuthPage }) {
  const location = useLocation();
  const isOwnerDashboard = location.pathname === "/ownerhome";

  return (
    <>
      {/* Modern Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="logo">Space Easy</Link>
          <div 
            className={`hamburger ${menuOpen ? 'active' : ''}`} 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
            {navLinks.map((link) => (
              (!link.hideWhenLoggedIn || !userLoggedIn) && 
              (!link.hideOnAuth || !isAuthPage(location.pathname)) &&
              (!link.hideOnOwnerDashboard || !isOwnerDashboard) &&
              // Hide Contact link for admin users
              !(userData?.type === "Admin" && link.path === "/contact") && (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-item ${link.className || ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            ))}
            {userLoggedIn && (
              <>
                {userData?.type === "Admin" && (
                  <>
                    <Link to="/adminhome" className="nav-item" onClick={() => setMenuOpen(false)}>
                      Admin Dashboard
                    </Link>
                    <div className="nav-item user-greeting-nav">
                      <span>Hi, System Admin</span>
                    </div>
                  </>
                )}
                {userData?.type === "Owner" && userData?.granted === "granted" && (
                  <>
                    <Link to="/ownerhome" className="nav-item" onClick={() => setMenuOpen(false)}>
                      Owner Dashboard
                    </Link>
                    <div className="nav-item user-greeting-nav">
                      <span>Hi, {userData?.name}</span>
                    </div>
                  </>
                )}
                {userData?.type === "Renter" && (
                  <>
                    <Link to="/renterhome" className="nav-item" onClick={() => setMenuOpen(false)}>
                      Renter Dashboard
                    </Link>
                    <div className="nav-item user-greeting-nav">
                      <span>Hi, {userData?.name}</span>
                    </div>
                  </>
                )}
                <Link 
                  to="/" 
                  className="nav-item logout-nav" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogOut();
                    setMenuOpen(false);
                  }}
                >
                  Logout
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/properties" element={<Properties />} />
          {userLoggedIn ? (
            <>
              <Route path="/adminhome" element={<AdminHome />} />
              <Route path="/ownerhome" element={<OwnerHome />} />
              <Route path="/renterhome" element={<RenterHome />} />
            </>
          ) : (
            <Route path="/login" element={<Login />} />
          )}
        </Routes>
      </div>

      {/* Modern Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Space Easy</h3>
              <p>Find your perfect home</p>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                {navLinks.map((link) => (
                  (!link.hideWhenLoggedIn || !userLoggedIn) && 
                  (!link.hideOnAuth || !isAuthPage(location.pathname)) &&
                  (!link.hideOnOwnerDashboard || !isOwnerDashboard) && (
                    <li key={link.path}>
                      <Link to={link.path}>{link.label}</Link>
                    </li>
                  )
                ))}
              </ul>
            </div>
            <div className="footer-section">
              <h3>Contact</h3>
              <p>Email: contact@houserental.com</p>
              <p>Phone: +91 8217099506</p>
              <p>Address: Vijayapura, Karnataka, India</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {date} Space Easy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
