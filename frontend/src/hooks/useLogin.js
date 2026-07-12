import { useState } from "react";
import useAuthContext from "./useAuthContext";
import { useNavigate } from "react-router-dom";
import { LoadingContext } from "../context/LoadingContext";
import React from "react";
import { API_URL } from "../config";

export default function useLogin() {
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();
  const { isLoading, dispatch: loadingDispatch } =
    React.useContext(LoadingContext);
  const navigate = useNavigate();

  const login = async (data) => {
    // loadingDispatch({ type: 'LOAD' });;
    setError(null);

    const response = await fetch(`${API_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data }),
    });
    const json = await response.json();

    if (!response.ok) {
      // loadingDispatch({ type: 'STOP_LOAD' });
      setError(json.error);
    }

    if (response.ok) {
      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(json));

      // update the auth context
      dispatch({ type: "LOGIN", payload: json });
      loadingDispatch({ type: "STOP_LOAD" });
      navigate("/");
    }
  };

  return { login, isLoading, error };
}
