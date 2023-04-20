import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiGet } from "../helper/services/api";
import { API } from "../config/API/api.config";

export default function OrderList() {
  const [orderlist, setOrderlist] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    ApiGet("order/history")
    .then((res) => {
     
      if(res?.payload){
        setOrderlist(res?.payload)
      }
    })
  }, []);

  const onInvoiceClick = (invoiceNo) => {
    const data =orderlist?.find((item)=> item?.invoiceNo == invoiceNo)

    console.log(invoiceNo,"invoiceNo")
    navigate(`/invoice/${invoiceNo}`,{ state: { data } });
  };
  return (
    <React.Fragment>
      <main class="contact-us">
        <section class="footer_get_touch_outer">
          <div class="container">
            <div class="footer_get_touch_inner">
              <div class="colmun-70 get_form">
                <div class="get_form_inner">
                  <div class="get_form_inner_text">
                    <h3>Order History</h3>
                  </div>
                  {orderlist?.length > 0 ? (
                    <table class="content-table">
                      <thead>
                        <tr>
                          <th>InvoiceNo</th>
                          <th>Image</th>
                          <th>Product</th>
                          <th>Quntity</th>
                          <th>Price</th>
                          <th>Tax</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderlist?.map((record, idx) => {
                            return (
                              <>
                                {record?.order?.map((obj, i) => {
                                  
                                  return (
                                    <>
                                      <tr
                                        onClick={() =>
                                          onInvoiceClick(record?.invoiceNo)
                                        }
                                        className={
                                          i % 2 == 0 ? "" : "active-row"
                                        }
                                      >
                                        <td>{record?.invoiceNo}</td>
                                        <td>
                                          <img
                                            src={`${API.imagePoint}/${obj?.productId?.images[0]}`}
                                            alt=""
                                          />
                                        </td>
                                        <td>{obj?.productId?.productName}</td>
                                        <td>{obj?.quantity}</td>
                                        <td>${obj?.price}</td>
                                        <td>$13</td>
                                      </tr>
                                    </>
                                  );
                                })}
                              </>
                            );
                          })}
                      </tbody>
                    </table>
                  ) : (
                    <div>
                      <div className="no-data">No Data Found</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </React.Fragment>
  );
}
