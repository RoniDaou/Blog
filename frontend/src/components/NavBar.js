import React from "react";
import "../styles/NavBar.css";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const navigationItems = [
  { to: "/", icon: "home", label: "Home", end: true },
  { to: "/blogs", icon: "explore", label: "Explore" },
];

export default function NavBar() {
  const { user } = React.useContext(AuthContext);
  const [isMobileActive, setIsMobileActive] = React.useState(false);

  const closeMenu = () => setIsMobileActive(false);

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <Link to="/" className="brand" onClick={closeMenu} aria-label="BlogMix home">
          <span className="brand-mark">B</span>
          <span className="brand-copy">
            <strong>BlogMix</strong>
            <small>Ideas worth sharing</small>
          </span>
        </Link>

        <button
          type="button"
          className={`mobile-menu-button${isMobileActive ? " is-open" : ""}`}
          onClick={() => setIsMobileActive((previous) => !previous)}
          aria-label="Toggle navigation"
          aria-expanded={isMobileActive}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-content${isMobileActive ? " is-open" : ""}`}>
          <div className="nav-links--container">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                onClick={closeMenu}
              >
                <span className="material-symbols-rounded">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}

            {user && (
              <NavLink
                to="/write"
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                onClick={closeMenu}
              >
                <span className="material-symbols-rounded">edit_square</span>
                <span>Create</span>
              </NavLink>
            )}

            {user && (
              <NavLink
                to="/account"
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                onClick={closeMenu}
              >
                <span className="material-symbols-rounded">person</span>
                <span>Profile</span>
              </NavLink>
            )}
          </div>

          <div className="nav-actions">
            {!user ? (
              <NavLink to="/signInUp" className="nav-sign-in" onClick={closeMenu}>
                Sign in
              </NavLink>
            ) : (
              <>
                <Link to="/account" className="nav-user" onClick={closeMenu}>
                  <span className="nav-user-avatar">
                    {(user.first_name || user.email || "U").charAt(0).toUpperCase()}
                  </span>
                  <span className="nav-user-label">My account</span>
                </Link>
                <NavLink to="/logout" className="nav-logout" onClick={closeMenu} aria-label="Log out">
                  <span className="material-symbols-rounded">logout</span>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
