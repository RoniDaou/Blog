import useLogout from "../hooks/useLogout";
import React from "react";

export default function Logout() {
  const { logout } = useLogout();

  React.useEffect(() => {
    logout();
    // Logout should run once when the route is opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
