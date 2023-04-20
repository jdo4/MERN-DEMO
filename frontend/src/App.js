import React from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { router } from "./Routes";
import list from "./data/product";
function App() {
  // let productsData = localStorage.getItem("list");
  // productsData = productsData
  //   ? productsData
  //   : localStorage.setItem("list", JSON.stringify(list));
  return (
    <React.Fragment>
      <Toaster />

      <RouterProvider router={router} />
    </React.Fragment>
  );
}

export default App;
