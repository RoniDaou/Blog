import React from "react";
import useLogin from "../hooks/useLogin";

function SignIn({ handleOnClick }) {
  const [state, setState] = React.useState({ email: "", password: "" });
  const { login, error } = useLogin();

  const handleChange = (event) => {
    setState((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    login(state);
  };

  return (
    <form className="auth-form" onSubmit={handleOnSubmit}>
      <div className="auth-form__heading">
        <span className="section-eyebrow">Welcome back</span>
        <h2>Sign in to BlogMix</h2>
        <p>Continue reading, writing, and managing your stories.</p>
      </div>

      <div className="auth-field">
        <label htmlFor="signin-email">Email address</label>
        <div className="auth-input-wrap">
          <span className="material-symbols-rounded">mail</span>
          <input
            id="signin-email"
            type="email"
            name="email"
            value={state.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor="signin-password">Password</label>
        <div className="auth-input-wrap">
          <span className="material-symbols-rounded">lock</span>
          <input
            id="signin-password"
            type="password"
            name="password"
            value={state.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>
      </div>

      {error && <p className="form-error"><span className="material-symbols-rounded">error</span>{error}</p>}

      <button type="submit" className="primary-button auth-submit">
        Sign in
        <span className="material-symbols-rounded">arrow_forward</span>
      </button>

      <p className="auth-switch">New to BlogMix? <button type="button" onClick={() => handleOnClick("signUp")}>Create an account</button></p>
    </form>
  );
}

export default SignIn;
