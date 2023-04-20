import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useOnClickOutside from "../useOnClickOutside";

export default function Header() {
  const navigate = useNavigate();
  const menuRef = useRef();
  let cartDataCount5 = localStorage.getItem("cartData");
  cartDataCount5 = cartDataCount5 ? JSON.parse(cartDataCount5) : [];
  const location = useLocation();
  const onRedirectToCart = () => {
    navigate("/cart");
  };

  const logout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("cartData");
    localStorage.removeItem("singleProductDetails");
    localStorage.removeItem("orderInfo");
    localStorage.removeItem("token");
  };

  const menutoggle = () => {
    var MenuItems = document.getElementById("MenuItems");
    if (MenuItems.style.maxHeight == "0px") {
      MenuItems.style.maxHeight = "200px";
    } else {
      MenuItems.style.maxHeight = "0px";
    }
  };
  useOnClickOutside(menuRef, () => {
    var MenuItems = document.getElementById("MenuItems");
    MenuItems.style.maxHeight = "0px";
  });
  return (
    <React.Fragment>
      <header className="header sticky">
        <div className="container">
          <div className="navbar" ref={menuRef}>
            <div className="logo">
              <h2>Vegetables</h2>
            </div>
            <nav>
              <ul id="MenuItems">
                <li
                  className={location.pathname === "/" ? "li-active" : ""}
                  onClick={menutoggle}
                >
                  <Link to="/">Home</Link>
                </li>
                <li
                  className={
                    location.pathname === "/product" ? "li-active" : ""
                  }
                  onClick={menutoggle}
                >
                  <Link to="/product">Products</Link>
                </li>
                <li
                  className={
                    location.pathname === "/orderlist" ? "li-active" : ""
                  }
                  onClick={menutoggle}
                >
                  <Link to="/orderlist">Order</Link>
                </li>
                <li
                  className={
                    location.pathname === "/profile" ? "li-active" : ""
                  }
                  onClick={menutoggle}
                >
                  <Link to="/profile">Profile</Link>
                </li>
                <li onClick={() => logout()}>
                  <Link to="/auth">Logout</Link>
                </li>
              </ul>
            </nav>
            <div onClick={() => onRedirectToCart()}>
              <img
                src={require("../../Assets/image/cart.png")}
                width="30px"
                height="30px"
              />
              <p className="count">{cartDataCount5?.length}</p>
            </div>
            <img
              src={require("../../Assets/image/menu.png")}
              className="menu-icon"
              onClick={() => menutoggle()}
            />
          </div>
        </div>
      </header>
    </React.Fragment>
  );
}
