import React from "react";
import { Link } from "react-router-dom";

export default function NotFound({ setDisplayFooter }) {
  React.useEffect(() => {
    setDisplayFooter(true);
  }, [setDisplayFooter]);

  return (
    <main className="not-found-page">
      <span className="not-found-code">404</span>
      <h1>We could not find that page.</h1>
      <p>The link may be outdated, or the page may have moved.</p>
      <Link to="/" className="primary-button">Return home</Link>
    </main>
  );
}
