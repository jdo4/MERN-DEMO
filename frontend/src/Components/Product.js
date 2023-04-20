import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import list from "../data/product";
import { ApiGetNoAuth, ApiPost } from "../helper/services/api";
import { API } from "../config/API/api.config";

export default function Product() {
 
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
      setProducts(res?.payload)
    })
  }, []);
  const onClickProductDetails = (id) => {
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
         navigate(`/cart`);

      }).catch((err) => {
          if(err?.code == 400){
            toast.error(err?.error)
          }
      })
  };
  return (
    <React.Fragment>
      <main>
        <div className="small-container">
          <div className="row row-2">
            <h2> Products</h2>
          </div>

          <div className="row grid-item">
            {products?.map((data, index) => {
              return (
                <div class="card">
                  <img
                    className="img-alignment"
                    onClick={() => onClickProductDetails(data.id)}
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
                      id={`quntity-${data._id}`}
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
        </div>
      </main>
    </React.Fragment>
  );
}
