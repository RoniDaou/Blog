import React from "react";
import useSignup from "../hooks/useSignup";

function SignUp({ handleOnClick }) {
  const [state, setState] = React.useState({ first_name: "", last_name: "", email: "", password: "" });
  const { signup, error } = useSignup();

  const handleChange = (event) => {
    setState((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    signup(state);
  };

  return (
    <form className="auth-form" onSubmit={handleOnSubmit}>
      <div className="auth-form__heading">
        <span className="section-eyebrow">Join the community</span>
        <h2>Create your account</h2>
        <p>Start sharing thoughtful stories with readers everywhere.</p>
      </div>

      <div className="auth-name-grid">
        <div className="auth-field">
          <label htmlFor="signup-first-name">First name</label>
          <div className="auth-input-wrap">
            <span className="material-symbols-rounded">person</span>
            <input id="signup-first-name" type="text" name="first_name" value={state.first_name} onChange={handleChange} placeholder="First name" required />
          </div>
        </div>
        <div className="auth-field">
          <label htmlFor="signup-last-name">Last name</label>
          <div className="auth-input-wrap">
            <span className="material-symbols-rounded">badge</span>
            <input id="signup-last-name" type="text" name="last_name" value={state.last_name} onChange={handleChange} placeholder="Last name" required />
          </div>
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor="signup-email">Email address</label>
        <div className="auth-input-wrap">
          <span className="material-symbols-rounded">mail</span>
          <input id="signup-email" type="email" name="email" value={state.email} onChange={handleChange} placeholder="you@example.com" required />
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor="signup-password">Password</label>
        <div className="auth-input-wrap">
          <span className="material-symbols-rounded">lock</span>
          <input id="signup-password" type="password" name="password" value={state.password} onChange={handleChange} placeholder="Create a secure password" required />
        </div>
      </div>

      {error && <p className="form-error"><span className="material-symbols-rounded">error</span>{error}</p>}

      <button type="submit" className="primary-button auth-submit">
        Create account
        <span className="material-symbols-rounded">arrow_forward</span>
      </button>

      <p className="auth-switch">Already have an account? <button type="button" onClick={() => handleOnClick("signIn")}>Sign in</button></p>
    </form>
  );
}

export default SignUp;
