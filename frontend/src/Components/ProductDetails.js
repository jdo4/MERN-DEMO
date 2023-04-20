import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate,useParams } from "react-router-dom";
import list from "../data/product";
import Avatar from "react-avatar";
import StarRating from "./StarRating";
import { ApiGet, ApiGetNoAuth, ApiPost } from "../helper/services/api";
import { API } from "../config/API/api.config";

export default function ProductDetails() {
  let {id : productId} = useParams();
  
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [commit, setCommit] = useState("");
  const [rating, setRating] = useState(0);
  const [item, setItem] = useState({});
  const handleChange = (value) => {
    setRating(value);
  };
 
  useEffect(()=> {
    if(productId){
      ApiGet(`product/get/${productId}`)
     .then((res) => {
      if(res?.payload){
        setItem(res?.payload)
      }
  })
    }

    ApiGetNoAuth("product/get")
    .then((res) => {
   
    if(res?.payload){
      setProducts(res?.payload)
    }
  })
},[productId])

  const onChangeQuntityProduct = (event, id) => {
    if (event.target.value !== "0") {
      item.quntity = Number(event.target.value);
      localStorage.setItem("singleProductDetails", JSON.stringify(item));
      setItem({ ...item });
    }
  };
  const imgClick = (url) => {
    document.getElementById(
      "ProductImg"
    ).src=`${API.imagePoint}/${url}`

  };

  const onAddCart = (id,singleItem = false) => {
    let data = singleItem ? item :  products.find((e) => e._id === id);

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

  const onSubmitComment = (e) => {
    e?.preventDefault();
    if (commit === "") {
      toast.error("Please enter comment.");
    } else {
      const payload = {
        ratting: rating,
        text: commit,
        productId
      }

      ApiPost("comment/create", payload)
      .then((res) => {
        setCommit("");
        setRating(0);
        
        toast.success("Comment created successfully.")
      }).catch((err) => {
          if(err?.code == 400){
            toast.error(err?.error)
          }
      })
    }
  };
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const onEnter = (e) => {
    if (e.key === "Enter") {
      onSubmitComment(e);
    }
  };
  return (
    <React.Fragment>
      <div className="small-container single-product">
        <div className="row">
          <div style={{ display: "flex" }} className="col-2">
            <div className="col-2">
              <img
                 src={`${API.imagePoint}/${item?.images?.[0]}`}
                alt=""
                className="ProductImg-small-img"
                id="ProductImg"
              />
            </div>
            <div className="col-2">
              {item?.images?.map((record, i) => {
                return (
                  <div className="small-img-col" onClick={() => imgClick(i)}>
                    <img
                      // src={require(`../Assets/${item?.images[i]}`)}
                      src={`${API.imagePoint}/${record}`}
                      alt=""
                      className="small-img"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-2">
          <h1>{item?.productName}</h1>
            <h4>${item?.pricing}.00</h4>
            <input
              type="number"
              min="1"
              id="quntity-${item?.id}"
              name="quntity"
              value={item?.quntity}
              onChange={(event) => onChangeQuntityProduct(event, item?._id)}
            />
            <p>
              <button className="btn" onClick={() => onAddCart(item?._id,true)}>
                Add to Cart
              </button>
            </p>

            <h3>Description</h3>
            <br />
            <p>{item?.description}</p>
          </div>
        </div>
      </div>

      <div className="small-container">
        <div className="row">
          <h2>Comments</h2>
        </div>
        <div className="comment-item">
          {item?.comment?.map((record) => {
            return (
              <div className="comment-items">
                <div className="username-icon">
                  <Avatar
                    name={record?.userId?.username}
                    size={"32px"}
                    color="green"
                    round
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div className="comment-text">
                <h4>{record?.userId?.username}</h4>
                <span>{record?.text}</span>
                </div>
                <StarRating
                  count={5}
                  size={40}
                  value={record?.rating}
                  activeColor={"rgb(202, 179, 7)"}
                  inactiveColor={"#ddd"}
                />
              </div>
            );
          })}
        </div>
        <div className="comment-box">
          <div>
            <div className="comment-alignment">
              <input
                type="text"
                name="commit"
                value={commit}
                onChange={(e) => setCommit(e.target.value)}
                onKeyDown={(e) => onEnter(e)}
                placeholder="Comment..."
              />
              <StarRating
                count={5}
                size={40}
                value={rating}
                activeColor={"rgb(202, 179, 7)"}
                inactiveColor={"#ddd"}
                onChange={handleChange}
              />
            </div>
            <div className="form-group-btn-commit">
              <button
                className="btn "
                onClick={(event) => onSubmitComment(event)}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
