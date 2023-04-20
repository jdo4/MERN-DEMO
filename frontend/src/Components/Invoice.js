import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { toast } from "react-hot-toast";
import { useNavigate, useParams,useLocation } from "react-router-dom";
import list from "../data/product";
import StarRating from "./StarRating";
import { API } from "../config/API/api.config";

export default function Invoice() {
  const location = useLocation();
  const { data:orderData } = location.state;

  const [orderInfo, setOrderInfo] = useState(orderData);

  const navigate = useNavigate();

  useEffect(() => {
    if (orderInfo && !Object.keys(orderInfo)?.length) {
      navigate("/");
    }
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  
 
  return (
    <React.Fragment>
      <main>
        <div className="invoice-box">
          <table>
            <tr class="top">
              <td colspan="4">
                <table>
                  <tr>
                    <td>
                      {" "}
                      Invoice #: {orderInfo?.invoiceNo}
                      <br />
                      Created : {new Date(orderInfo.createdAt).getDate()}/
                      {new Date(orderInfo.createdAt).getMonth()}/
                      {new Date(orderInfo.createdAt).getFullYear()}
                      <br />
                      Due : {new Date(orderInfo.duedate).getDate()}/
                      {new Date(orderInfo.duedate).getMonth()}/
                      {new Date(orderInfo.duedate).getFullYear()}
                    </td>
                    <td></td>
                    <td>
                      {" "}
                      {orderInfo?.name}.<br />
                      {orderInfo?.email}
                      {/* {orderInfo.email} */}
                      <br />
                      {orderInfo?.phone}
                    </td>
                    <td>
                      <b>Address : </b>
                      <br />
                      {orderInfo?.addressDetail?.address}, {orderInfo.addressDetail.city}.<br />
                      {orderInfo?.addressDetail?.province}, {orderInfo?.addressDetail?.postcode}
                   </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr class="heading">
              <td>Item</td>
              <td>Quntity</td>
              <td>Unit Price</td>
              <td>Total Price</td>
            </tr>
            {orderInfo.order?.map((item) => {
              return (
                <tr class="item">
                  <td class="item-invoice">
                    <img src={`${API.imagePoint}/${item?.productId?.images[0]}`} alt="" />
                  
                    <p>{item.productId.productName}</p>
                  </td>
                  <td>{item.quantity}</td>
                  <td>${item.price}</td>
                  <td>${item.price * Number(item.quantity)}.00</td>
                </tr>
              );
            })}
            <tr class="total">
              <td></td>
              <td></td>
              <td></td>
              <td>
                <b>Total: </b>&nbsp;&nbsp;&nbsp;${orderInfo.totalPrice}.00
              </td>
            </tr>

            <tr class="total">
              <td></td>
              <td></td>
              <td></td>
              <td>
                <b>Tax: </b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$
                {orderInfo.totalShippingCost}.00
              </td>
            </tr>
          </table>
         
        </div>
      </main>
    </React.Fragment>
  );
}
