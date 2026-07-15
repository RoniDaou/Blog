import { Link } from "react-router-dom";
import "../styles/footer.css";
import useAuthContext from "../hooks/useAuthContext";

const Footer = () => {
  const { user } = useAuthContext();

  return (
    <footer className="footerComp">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-col-span-2 footer-md-col-span-3 footer-lg-col-span-2">
            <p className="footer-text">
              <span className="material-symbols-outlined">globe_uk</span>
              The Daily Blog. Your daily dose of diverse delights.
            </p>
          </div>
          <div>
            <p className="footer-section-title">Usefull links</p>
            <ul className="footer-link-list">
              {user && (
                <li>
                  <Link to="/account" className="footer-link">
                    <span className="material-symbols-outlined">person</span>
                    Your account
                  </Link>
                </li>
              )}
              {user && (
                <li>
                  <Link to="/blogs" className="footer-link">
                    <span className="material-symbols-outlined">apps</span>All
                    blogs
                  </Link>
                </li>
              )}
              {!user && (
                <li>
                  <Link to="/signInUp" className="footer-link">
                    <span className="material-symbols-outlined">login</span>
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div>
            <p className="footer-section-title">Contact</p>
            <ul className="footer-link-list">
              <li>
                <span className="material-symbols-outlined">location_on</span>
                Beirut, Lebanon
              </li>
              <li>
                <span className="material-symbols-outlined">mail</span>
                infox@TheBlogMix.com
              </li>
              <li>
                <span className="material-symbols-outlined">call</span>
                01/666-777
              </li>
            </ul>
          </div>
        </div>
        <hr className="footer-divider" />
        <p className="footer-bottom-text">
          © 2024 The Daily Blog. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
