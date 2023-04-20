import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  let cartData = localStorage.getItem("cartData");
  cartData = cartData ? JSON.parse(cartData) : [];
  useEffect(() => {
    let footerContainer = document.getElementById("footer-cart");
    if (location.pathname === "/cart") {
      // if (!cartData?.length) {
      footerContainer?.classList?.add("footer-cart-page");
      // }
    } else {
      footerContainer?.classList?.remove("footer-cart-page");
    }
  }, [location.pathname]);
  return (
    <React.Fragment>
      <footer className="footer " id="footer-cart">
        <div className="container">
          <div className="row">
            <div className="footer-col-1">
              <div className="app-logo">
                <a href="https://play.google.com/" target="_blank">
                  <img
                    src={require("../../Assets/image/play-store.png")}
                    alt=""
                  />
                </a>
                <a href="https://www.apple.com/app-store/" target="_blank">
                  <img
                    src={require("../../Assets/image/app-store.png")}
                    alt=""
                  />
                </a>
              </div>
            </div>
          </div>
          <hr />
          <p className="copyright">
            Copyright © 2022-2031. All rights reserved.
          </p>
        </div>
      </footer>
    </React.Fragment>
  );
}
