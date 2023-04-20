import React from "react";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  return (
    <div>
      <h1>404 Not Found</h1>
      <h3>{error.statusText}</h3>
    </div>
  );
};

export default ErrorPage;
