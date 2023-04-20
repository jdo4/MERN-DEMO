import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import list from "../data/product";
import { ApiGetNoAuth, ApiPost } from "../helper/services/api";
import { toast } from "react-hot-toast";
import { API } from "../config/API/api.config";

export default function Dashboard() {
  // let productsData = localStorage.getItem("list");
  // productsData = productsData
  //   ? JSON.parse(productsData)
  //   : localStorage.setItem("list", JSON.stringify(list));
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const onChangeQuntityProduct = (event, id) => {
    if (event.target.value !== "0") {
      let findIndex = products?.findIndex((e) => e._id === id);
      if (findIndex !== -1) {
        products[findIndex].quntity = Number(event.target.value);
      }
      setProducts([...products]);
    }
  };
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    ApiGetNoAuth("product/get")
    .then((res) => {
     
      if(res?.payload){
        setProducts(res?.payload)
      }
    })
  }, []);
  const onClickProductDetails = (id) => {
    // let data = products.find((e) => e.id === id);
    // localStorage.setItem("singleProductDetails", JSON.stringify(data));
    // navigate(`/product-details/${id}`);
    navigate(`/product-details/${id}`);

  };

  const onAddCart = (id) => {
    let data = products.find((e) => e._id === id);

    const payload = {
      productId : id,
      quantity :  data.quntity ? data.quntity : 1
    }

    ApiPost("cart/add-product-to-cart", payload)
      .then((res) => {
        toast.success("Successfully added in cart.");

      }).catch((err) => {
          if(err?.code == 400){
            toast.error(err?.error)
          }
      })
    navigate(`/cart`);
  };
  return (
    <React.Fragment>
      <header className="header2">
        <div className="container">
          <div className="row banner">
            <div className="col-2">
              <h1>Start bring vegetables</h1>

              <Link to="/product" className="btn">
                Online Order Now
              </Link>
            </div>
            <div className="col-2"></div>
          </div>
        </div>
      </header>
      <main>
        <section className="small-container">
          <h2 className="title">Product</h2>
          <div className="row grid-item">
            {products?.slice(0, 3)?.map((data, index) => {
              return (
                <div class="card">
                  <img
                    className="img-alignment"
                    onClick={() => onClickProductDetails(data._id)}
                    src={`${API.imagePoint}/${data.images[0]}`}
                    alt={`product-${index}`}
                  />
                  <h1>{data.productName}</h1>
                  <p class="price">${data.pricing}.00</p>
                  <p>{data?.description}</p>
                  <div className="input-quntity">
                    <label for={`quntity-${data._id}`}>Quntity </label>
                    <input
                      type="number"
                      min="1"
                      id={`quntity-${data.id}`}
                      name="quntity"
                      value={data.quntity}
                      onChange={(event) =>
                        onChangeQuntityProduct(event, data._id)
                      }
                    />
                  </div>
                  <p>
                    <button onClick={() => onAddCart(data._id)}>
                      Add to Cart
                    </button>
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </React.Fragment>
  );
}
