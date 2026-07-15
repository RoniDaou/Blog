import { LoadingContext } from "../context/LoadingContext";
import React from "react";

export default function Loader() {
  const { isLoading } = React.useContext(LoadingContext);
  return isLoading ? (
    <div className="spinner" role="status" aria-label="Loading">
      <div className="loading-ring" />
    </div>
  ) : null;
}
