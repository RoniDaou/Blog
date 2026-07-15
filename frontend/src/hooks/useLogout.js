import React from "react";
import useAuthContext from "./useAuthContext";
import { useNavigate } from "react-router-dom";

export default function useLogout() {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const logout = React.useCallback(() => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    navigate("/");
  }, [dispatch, navigate]);

  return { logout };
}
