import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Auth from "../Components/Auth";
import Cart from "../Components/Cart";
import Dashboard from "../Components/Dashboard";
import ErrorPage from "../Components/ErrorPage";
import Invoice from "../Components/Invoice";
import Product from "../Components/Product";
import ProductDetails from "../Components/ProductDetails";
import Profile from "../Components/Profile";
import OrderList from "../Components/OrdetList";

import { Outlet } from "react-router-dom";
import Footer from "../Components/Layout/Footer";
import Header from "../Components/Layout/Header";

export const DefaultLayout = () => (
  <>
    <Outlet />
  </>
);

export const AuthLayout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("userData");

  if (isAuthenticated) return children;

  return <Navigate to="/auth" />;
};

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: "orderlist",
        element: (
          <ProtectedRoute>
            <OrderList />
          </ProtectedRoute>
        ),
      },
      {
        path: "invoice/:invoiceNo",
        element: (
          <ProtectedRoute>
            <Invoice />
          </ProtectedRoute>
        ),
      },
      {
        path: "product",
        element: (
          <ProtectedRoute>
            <Product />
          </ProtectedRoute>
        ),
      },
      {
        path: "product-details/:id",
        element: (
          <ProtectedRoute>
            <ProductDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },

  {
    path: "/errors/404",
    element: (
      <DefaultLayout>
        <ErrorPage />
      </DefaultLayout>
    ),
    errorElement: <ErrorPage />,
  },
]);
