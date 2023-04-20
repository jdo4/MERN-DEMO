import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ApiDelete, ApiGet, ApiPost } from "../helper/services/api";
import { API } from "../config/API/api.config";

export default function Cart() {
  
  const [modal, setModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [purchaseInput, setPurchaseInput] = useState();
  const [cartItem, setCart] = useState([]);
  const navigate = useNavigate();

  // const onClickProductDetails = (id) => {
  //   let data = cartData.find((e) => e.id === id);
  //   localStorage.setItem("singleProductDetails", JSON.stringify(data));
  //   navigate(`/product-details/${id}`);
  // };

  const remove = (id) => {
    let cartDataList = [...cartItem];
    cartDataList = cartDataList.filter((e) => e.productId !== id);
    setCart(cartDataList);

    //delete product from database by ID
    ApiDelete(`cart/delete-product-to-cart/${id}`).then((res) => {
      toast.success("Item remove Successfully.");
    })
  };

const cartGet = () => {
  //GET all of the documents from cart
  ApiGet("cart/get")
  .then((res) => {
    if(res?.payload?.[0]?.products){
      //display the recoed to user
      setCart(res?.payload?.[0]?.products)
    }
  })

}

  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    //initial cart table document check
    cartGet()
   
  }, []);

  const onChangeQuntity = (event, id) => {
    if (event.target.value !== "0") {
      let findIndex = cartItem?.findIndex((e) => e.productId === id);

      console.log(findIndex,"findIndex")
      if (findIndex !== -1) {
        cartItem[findIndex].quantity = Number(event.target.value);
      }
       
      setCart([...cartItem]);
    }
  };

  const showModal = () => {
    setModal(true);
  };

  const hideModal = () => {
    setModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPurchaseInput({
      ...purchaseInput,
      [name]: value,
    });
  };

  //checkout form validation
  const validateFrom = () => {
    let error = {};
    const min = 3,
      max = 25;
    const isBetween = (length, min, max) =>
      length < min || length > max ? false : true;

      //phone no validation
    const isPhoneValid = (p) => {
      var phoneRe = /^[2-9]\d{2}[2-9]\d{2}\d{4}$/;
      var digits = p.replace(/\D/g, "");
      return phoneRe.test(digits);
    };

    //credit card no validation
    const isCreditCardNumberValid = (card_number) => {
      var cc =
        /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11}|62[0-9]{14})$/;

      return cc.test(card_number);
    };

    const isEmailValid = (email) => {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    };

    //showwing error if there is any wrong input
    if (!purchaseInput?.addre) {
      error["addre"] = "Address cannot be blank.";
    } else if (!isBetween(purchaseInput?.addre.length, min, max)) {
      error["addre"] = `Address must be between ${min} and ${max} characters.`;
    }
    if (!purchaseInput?.expMonth) {
      error["expMonth"] = "Expiration Mpnth cannot be blank.";
    }
    if (!purchaseInput?.expYear) {
      error["expYear"] = "Expiration Year cannot be blank.";
    }
    if (!purchaseInput?.cardNumber) {
      error["cardNumber"] = "Card Number cannot be blank.";
    } else if (
      !isCreditCardNumberValid(purchaseInput?.cardNumber.replace(/\s/g, ""))
    ) {
      error["cardNumber"] = "Card Number is not valid. ";
    }

    if (!purchaseInput?.cvv) {
      error["cvv"] = "CVV cannot be blank.";
    }

    if (!purchaseInput?.pho) {
      error["pho"] = "phone cannot be blank.";
    } else if (!isPhoneValid(purchaseInput?.pho)) {
      error["pho"] = "Phone is not valid.";
    }

    if (Object.keys(error)?.length) {
      setErrors(error);
      return false;
    } else {
      setErrors({});
      return true;
    }
  };

  const onPurchase = (e) => {
    //payment btn click function
    e.preventDefault();
    if (validateFrom()) {
      let subtotal = 0;
      let total = 0;
      subtotal = cartItem.reduce((accumulator, object) => {
        return accumulator + object.product?.pricing * object.quantity;
      }, 0);
      let totalTax = cartItem?.length ? 13 : 0;
      total = subtotal + totalTax;
      var duedate = new Date();
      duedate.setDate(duedate.getDate() + 2);
      let userInfo = {
        name : purchaseInput?.na,
        phone : purchaseInput?.pho,
        email : purchaseInput?.ema,
        owner : purchaseInput.owner,
        cardDetail : {
          CVV : purchaseInput.cvv,
          cardNumber : purchaseInput?.cardNumber,
          expMonth: purchaseInput?.expMonth,
          expYear: purchaseInput?.expYear,
        },
        addressDetail : {
          address :  purchaseInput?.addre,
           city : purchaseInput?.city,
           province : purchaseInput?.province,
           postcode : purchaseInput?.postco,
        },
        order : cartItem?.map((item)=>{
             return {
              productId  : item.productId,
              quantity : item.quantity,
              price : item?.product?.pricing,
              total : item?.product?.pricing * item.quantity,
             }
        }),
        totalPrice:  total,
        totalShippingCost: totalTax,
        invoiceNo: String(+new Date()),
      };

     // console.log(userInfo,"userInfo")

     //posting details into database
      ApiPost("order/purchase", userInfo)
      .then((res) => {
        toast.success("Order Successfully Created.");
         navigate(`/`);
        hideModal()
        setPurchaseInput({})
        cartGet()
      }).catch((err) => {
          if(err?.code == 400){
            toast.error(err?.error)
          }
      })
    }
  };

  const onKeyDown = (event) => {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  };

  const handleCardChange = (e) => {
    var cardNumber = e.target.value;

    // Do not allow users to write invalid characters
    var formattedCardNumber = cardNumber.replace(/[^\d]/g, "");
    formattedCardNumber = formattedCardNumber.substring(0, 16);

    // Split the card number is groups of 4
    var cardNumberSections = formattedCardNumber.match(/\d{1,4}/g);
    if (cardNumberSections !== null) {
      formattedCardNumber = cardNumberSections.join(" ");
    }

    setPurchaseInput({
      ...purchaseInput,
      [e.target.name]: formattedCardNumber,
    });
  };

  return (
    <React.Fragment>
      <main className="small-container cart-page ">
        <section>
          <div className="CartContainer">
            {cartItem?.length > 0 ? (
              <>
                {cartItem?.map((o) => {
                  return (
                    <div className="Cart-Items">
                      <div className="image-box">
                        <img
                          src={`${API.imagePoint}/${o?.product?.images[0]}`}
                         // src={require(`../Assets/${o.thumbnail}`)}
                          // onClick={() => onClickProductDetails(o.id)}
                          style={{ height: "120px" }}
                        />
                      </div>
                      <div className="about">
                        <h1>{o.product?.productName}</h1>
                      </div>
                      <div className="counter">
                        <input
                          type="number"
                          min="1"
                          id={`quntity-${o.id}`}
                          name="quntity"
                          value={o.quantity}
                          onChange={(event) =>  onChangeQuntity(event, o.productId)}
                        />
                      </div>
                      <div className="prices">
                        <div className="amount">
                          ${o.product?.pricing} * {o?.quantity}(Qty)
                        </div>

                        <div className="remove" onClick={() => remove(o.productId)}>
                          <u>Remove</u>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="checkout">
                  {/* <div className="total">
                    <div>
                      <div className="Subtotal">Sub Total</div>
                    </div>

                    <div className="total-amount">
                      $
                      {cartItem?.reduce((accumulator, object) => {
                      return accumulator + (object?.product?.pricing ?? 0) * object.quantity;
                    }, 0) + (cartItem?.length ? 13 : 0)}
                    .00
                    </div>
                  </div> */}
                  <div className="total">
                    <div>
                      <div className="Subtotal">Tax</div>
                    </div>

                    <div className="total-amount">$13.00</div>
                  </div>
                  <div className="total">
                    <div>
                      <div className="Subtotal">Total</div>
                      <div className="items">{cartItem?.length} items</div>
                    </div>

                    <div className="total-amount">
                      $
                      {cartItem?.reduce((accumulator, object) => {
                      return accumulator + (object?.product?.pricing ?? 0) * object.quantity;
                    }, 0) + (cartItem?.length ? 13 : 0)}
                      .00
                    </div>
                  </div>
                  <button onClick={() => showModal()} className="btn">
                    Checkout
                  </button>
                </div>
              </>
            ) : (
              <div>
                <div className="no-data">No Data Found</div>
              </div>
            )}
          </div>
        </section>
      </main>

      {modal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => hideModal()}>
              &times;
            </span>
            <div className="heading">
              <h1>Payout</h1>
            </div>
            <div className="creditCardForm">
              <div className="payment">
                <form>
                <div
                    className={
                      errors["na"] ? "error form-group name" : "form-group name"
                    }
                  >
                    <label for="name">
                      Name <span className="madatory">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="na"
                      value={purchaseInput?.na}
                      onChange={handleChange}
                      placeholder="Enter Your Name..."
                    />
                    <small>{errors["na"]}</small>
                  </div>
                  <div
                    className={
                      errors["pho"]
                        ? "error form-group name"
                        : "form-group name"
                    }
                  >
                    <label for="phone">
                      Phone <span className="madatory">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      onKeyPress={(e) => onKeyDown(e)}
                      name="pho"
                      value={purchaseInput?.pho}
                      onChange={handleChange}
                      placeholder="Enter Your Phone..."
                    />
                    <small>{errors["pho"]}</small>
                  </div>
                  <div
                    className={
                      errors["ema"]
                        ? "error form-group email"
                        : "form-group email"
                    }
                  >
                    <label for="email">
                      Email <span className="madatory">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      name="ema"
                      value={purchaseInput?.ema}
                      onChange={handleChange}
                      placeholder="Enter Your Email..."
                    />
                    <small>{errors["ema"]}</small>
                  </div>
                  <div
                    className={
                      errors["postco"]
                        ? "error form-group phone"
                        : "form-group phone"
                    }
                  >
                    <label for="Postcode">
                      Postcode <span className="madatory">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="Postcode"
                      name="postco"
                      value={purchaseInput?.postco}
                      onChange={handleChange}
                      placeholder="Enter Your Postcode..."
                    />
                    <small>{errors["postco"]}</small>
                  </div>
                  <div
                    className={
                      errors["city"]
                        ? "error form-group name"
                        : "form-group name"
                    }
                  >
                    <label for="City">
                      City <span className="madatory">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="City"
                      value={purchaseInput?.city}
                      name="city"
                      onChange={handleChange}
                      placeholder="Enter Your City..."
                    />
                    <small>{errors["city"]}</small>
                  </div>
                  <div
                    className={
                      errors["addre"]
                        ? "error form-group phone"
                        : "form-group phone"
                    }
                  >
                    <label for="Address">
                      Address <span className="madatory">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="Address"
                      name="addre"
                      value={purchaseInput?.addre}
                      onChange={handleChange}
                      placeholder="Enter Your Address..."
                    />
                    <small>{errors["addre"]}</small>
                  </div>

                  <div
                    className={
                      errors["cvv"] ? "error form-group CVV" : "form-group CVV"
                    }
                  >
                    <label for="cvv">
                      CVV <span className="madatory">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cvv"
                      name="cvv"
                      onKeyPress={(e) => onKeyDown(e)}
                      value={purchaseInput?.cvv}
                      onChange={handleChange}
                      placeholder="Enter Your CVV..."
                    />
                    <small>{errors["cvv"]}</small>
                  </div>
                  <div
                    className={
                      errors["cardNumber"] ? "error form-group " : "form-group "
                    }
                    id="card-number-field"
                  >
                    <label for="cardNumber">
                      Card Number <span className="madatory">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cardNumber"
                      onKeyPress={(e) => onKeyDown(e)}
                      name="cardNumber"
                      value={purchaseInput?.cardNumber}
                      onChange={handleCardChange}
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                    />
                    <small>{errors["cardNumber"]}</small>
                  </div>
                  <div
                    className={
                      errors["expMonth"] || errors["expYear"]
                        ? "error form-group "
                        : "form-group "
                    }
                  >
                    <label>
                      Expiration Date <span className="madatory">*</span>
                    </label>
                    <select
                      id="expiration-month"
                      name="expMonth"
                      value={purchaseInput?.expMonth}
                      onChange={handleChange}
                    >
                      <option value="" selected>
                        MM
                      </option>
                      <option value="01">January</option>
                      <option value="02">February</option>
                      <option value="03">March</option>
                      <option value="04">April</option>
                      <option value="05">May</option>
                      <option value="06">June</option>
                      <option value="07">July</option>
                      <option value="08">August</option>
                      <option value="09">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>
                    <select
                      id="expiration-year"
                      name="expYear"
                      value={purchaseInput?.expYear}
                      onChange={handleChange}
                    >
                      <option value="" selected>
                        YYYY
                      </option>
                      <option value="16">2016</option>
                      <option value="17">2017</option>
                      <option value="18">2018</option>
                      <option value="19">2019</option>
                      <option value="20">2020</option>
                      <option value="21">2021</option>
                      <option value="21">2022</option>
                      <option value="21">2023</option>
                      <option value="21">2024</option>
                      <option value="21">2025</option>
                    </select>
                    <small>{errors["expMonth"] || errors["expYear"]}</small>
                  </div>
                  <div className="form-group" id="credit_cards">
                    <img src={require("../Assets/image/visa.jpg")} id="visa" />
                    <img
                      src={require("../Assets/image/mastercard.jpg")}
                      id="mastercard"
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="form-group-btn" id="pay-now">
              <button
                type="submit"
                className="btn "
                id="confirm-purchase"
                onClick={(event) => onPurchase(event)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
