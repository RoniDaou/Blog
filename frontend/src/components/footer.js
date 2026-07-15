import { Link } from "react-router-dom";
import "../styles/footer.css";
import useAuthContext from "../hooks/useAuthContext";

const Footer = () => {
  const { user } = useAuthContext();

  return (
    <footer className="footerComp">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand-block">
            <Link to="/" className="footer-brand">
              <span className="brand-mark">B</span>
              <strong>BlogMix</strong>
            </Link>
            <p className="footer-text">
              A thoughtful space for stories, perspectives, and ideas that bring
              people together.
            </p>
          </div>

          <div className="footer-column">
            <p className="footer-section-title">Discover</p>
            <Link to="/" className="footer-link">
              Home
            </Link>
            <Link to="/blogs" className="footer-link">
              Explore stories
            </Link>
            {user && (
              <Link to="/write" className="footer-link">
                Write a story
              </Link>
            )}
          </div>

          <div className="footer-column">
            <p className="footer-section-title">Account</p>
            {user ? (
              <>
                <Link to="/account" className="footer-link">
                  Profile settings
                </Link>
                <Link to="/logout" className="footer-link">
                  Log out
                </Link>
              </>
            ) : (
              <Link to="/signInUp" className="footer-link">
                Sign in or join
              </Link>
            )}
          </div>

          <div className="footer-column">
            <p className="footer-section-title">Contact</p>
            <span className="footer-contact">
              <span className="material-symbols-rounded">location_on</span>
              Beirut, Lebanon
            </span>
            <span className="footer-contact">
              <span className="material-symbols-rounded">mail</span>
              cgr@theblog.com
            </span>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} BlogMix. All rights reserved.</p>
          <p>Built for meaningful publishing.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
