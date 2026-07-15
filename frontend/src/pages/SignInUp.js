import React, { useState } from "react";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

export default function SignInUp({ setDisplayFooter }) {
  const [type, setType] = useState("signIn");

  React.useEffect(() => {
    setDisplayFooter(false);
  }, [setDisplayFooter]);

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <section className="auth-showcase">
          <div className="auth-showcase__content">
            <span className="auth-brand"><span className="brand-mark">B</span>BlogMix</span>
            <span className="hero-kicker"><span className="material-symbols-rounded">auto_awesome</span>Write. Share. Connect.</span>
            <h1>Your ideas deserve a beautiful place to live.</h1>
            <p>Join a modern publishing community built for thoughtful stories and meaningful conversations.</p>
            <div className="auth-benefits">
              <div><span className="material-symbols-rounded">check_circle</span><span>Publish stories in minutes</span></div>
              <div><span className="material-symbols-rounded">check_circle</span><span>Build your personal profile</span></div>
              <div><span className="material-symbols-rounded">check_circle</span><span>Connect through reader reactions</span></div>
            </div>
          </div>
          <div className="auth-decoration auth-decoration--one" />
          <div className="auth-decoration auth-decoration--two" />
        </section>

        <section className="auth-panel">
          <div className="auth-tabs" role="tablist" aria-label="Authentication options">
            <button
              type="button"
              className={type === "signIn" ? "active" : ""}
              onClick={() => setType("signIn")}
            >
              Sign in
            </button>
            <button
              type="button"
              className={type === "signUp" ? "active" : ""}
              onClick={() => setType("signUp")}
            >
              Create account
            </button>
          </div>

          {type === "signIn" ? (
            <SignIn handleOnClick={setType} />
          ) : (
            <SignUp handleOnClick={setType} />
          )}
        </section>
      </div>
    </main>
  );
}
