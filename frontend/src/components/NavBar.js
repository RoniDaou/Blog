// NavBar.js
import React from "react";
import "../styles/NavBar.css";
import { NavLink } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

export default function NavBar() {
  const { user } = React.useContext(AuthContext);
  const isMedium = useMediaQuery("(max-width: 710px)");
  const [isMobileActive, setIsMobileActive] = React.useState(false);
  const [navLinks, setNavLinks] = React.useState();

  React.useEffect(() => {
    setNavLinks(
      <div
        className={`${isMedium ? "nav-links-mobile" : "nav-links--container"}`}
      >
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "none")}
          onClick={handleClick}
        >
          <div className="icon-text">
            <span className="material-symbols-outlined">home</span>
            <span className="text">Home</span>
          </div>
        </NavLink>

        {!user && (
          <NavLink
            to="/signInUp"
            className={({ isActive }) => (isActive ? "active" : "none")}
            onClick={handleClick}
          >
            <div className="icon-text">
              <span className="material-symbols-outlined">person_add</span>
              <span className="text">Signup</span>
            </div>
          </NavLink>
        )}

        {user && (
          <NavLink
            to="/write"
            className={({ isActive }) => (isActive ? "active" : "none")}
            onClick={handleClick}
          >
            <div className="icon-text">
              <span className="material-symbols-outlined">edit_square</span>
              <span className="text">Post</span>
            </div>
          </NavLink>
        )}

        {user && (
          <NavLink
            to="/account"
            className={({ isActive }) => (isActive ? "active" : "none")}
            onClick={handleClick}
          >
            <div className="icon-text">
              <span className="material-symbols-outlined">person</span>
              <span className="text">Profile</span>
            </div>
          </NavLink>
        )}

        {user && (
          <NavLink
            to="/logout"
            className={({ isActive }) => (isActive ? "active" : "none")}
            onClick={handleClick}
          >
            <div className="icon-text">
              <span className="material-symbols-outlined">logout</span>
              <span className="text">Logout</span>
            </div>
          </NavLink>
        )}
      </div>,
    );
  }, [isMedium, user]);

  function handleClick() {
    if (isMedium) {
      setIsMobileActive((prev) => !prev);
    }
  }

  return (
    <div className={`topnav${isMobileActive ? " topnav-active" : ""}`}>
      <div className={isMobileActive ? "space-between" : "topnav"}>
        <div className="nav-title">The Blog</div>
        {isMedium ? (
          <div
            className={`hamburger${isMobileActive ? " active" : ""}`}
            onClick={handleClick}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        ) : (
          navLinks
        )}
      </div>

      {isMedium && isMobileActive && navLinks}
    </div>
  );
}
