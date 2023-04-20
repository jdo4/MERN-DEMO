import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ApiGet, ApiPut } from "../helper/services/api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState({});
  const [errors, setErrors] = useState({});
  const [passwordType, setPasswordType] = useState("password");
  const [passwordType1, setPasswordType1] = useState("password");
  const navigate = useNavigate();

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const togglePassword1 = () => {
    if (passwordType1 === "password") {
      setPasswordType1("text");
      return;
    }
    setPasswordType1("password");
  };

  const handleChnage = (e) => {
    const { name, value } = e?.target;
    setUser({
      ...user,
      [name]: value,
    });
  };
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    ApiGet("user/get/profile")
  .then((res) => {

    setUser({
      ...res?.payload,
    })
    
  })
  }, []);
  const validateFrom = () => {
    let error = {};
    const min = 3,
      max = 25;
    const isBetween = (length, min, max) =>
      length < min || length > max ? false : true;
    const isPasswordSecure = (password) => {
      const re = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
      );
      return re.test(password);
    };
    const isEmailValid = (email) => {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    };
   if (user?.password && !isPasswordSecure(user?.password)) {
      error["password"] =
        "Password must has at least 8 characters that include at least 1 lowercase character, 1 uppercase characters, 1 number, and 1 special character in (!@#$%^&*)";
    }
    if (!user?.email) {
      error["email"] = "Email cannot be blank.";
    } else if (!isEmailValid(user?.email)) {
      error["email"] = "Email is not valid.";
    }
    if (!user?.username) {
      error["username"] = "Username cannot be blank.";
    } else if (!isBetween(user?.username?.length, min, max)) {
      error[
        "username"
      ] = `Username must be between ${min} and ${max} characters.`;
    }
    if (user?.password) {
      if (!user?.confirmPassword) {
        error["confirmPassword"] = "Please enter the password again.";
      } else if (user?.password !== user?.confirmPassword) {
        error["confirmPassword"] = "confirmPassword is not valid.";
      }
    }
    if (Object.keys(error)?.length) {
      setErrors(error);
      return false;
    } else {
      setErrors({});
      return true;
    }
  };

  const onUpdateProfile = (e) => {
    e?.preventDefault();
    if (validateFrom()) {


      ApiPut("user/update/profile", user)
      .then((res) => {
         setUser({})
         toast.success("Successfully update your profile.");
          navigate("/");
      })
      // if (user?.confirmPassword) {
      //   delete user?.confirmPassword;
      // }
      // let registerUser = localStorage.getItem("registerUser");
      // registerUser = JSON.parse(registerUser);
      // let index = registerUser.findIndex(
      //   (obj) => Number(obj.id) === Number(user.id)
      // );
      // registerUser[index] = user;
      // localStorage.setItem("registerUser", JSON.stringify(registerUser));
      // localStorage.setItem("userData", JSON.stringify(user));
      
    }
  };
  return (
    <React.Fragment>
      <main className="contact-us">
        <section className="footer_get_touch_outer">
          <div className="container">
            <div className="footer_get_touch_inner">
              <div className="colmun-70 get_form">
                <div className="get_form_inner">
                  <div className="get_form_inner_text">
                    <h3>My Profile</h3>
                  </div>
                  <form>
                    <div className="grid-50-50">
                      <div
                        className={
                          errors["username"] ? "error form-field" : "form-field"
                        }
                      >
                        <input
                          type="text"
                          value={user?.username}
                          name="username"
                          onChange={handleChnage}
                          placeholder="UserName"
                        />
                        <small className="small">{errors["username"]}</small>
                      </div>
                      <div
                        className={
                          errors["email"] ? "error form-field" : "form-field"
                        }
                      >
                        <input
                          type="email"
                          name="email"
                          onChange={handleChnage}
                          value={user?.email}
                          placeholder="Email"
                        />
                        <small className="small">{errors["email"]}</small>
                      </div>
                      <div
                        className={
                          errors["password"]
                            ? "error form-field input-relative"
                            : "input-relative form-field"
                        }
                      >
                        <input
                          type={passwordType}
                          name="password"
                          onChange={handleChnage}
                          value={user?.password}
                          placeholder="Password"
                        />
                        <div
                          className="position-icons"
                          onClick={togglePassword}
                        >
                          {passwordType !== "text" ? (
                            <i className="fa fa-eye-slash" />
                          ) : (
                            <i className="fa fa-eye" />
                          )}
                        </div>
                        <small className="small">{errors["password"]}</small>
                      </div>
                      <div
                        className={
                          errors["confirmPassword"]
                            ? "error form-field input-relative"
                            : "form-field input-relative"
                        }
                      >
                        <input
                          type={passwordType1}
                          name="confirmPassword"
                          onChange={handleChnage}
                          value={user?.confirmPassword}
                          placeholder="Confirm password"
                        />
                        <div
                          className="position-icons"
                          onClick={togglePassword1}
                        >
                          {passwordType1 !== "text" ? (
                            <i className="fa fa-eye-slash" />
                          ) : (
                            <i className="fa fa-eye" />
                          )}
                        </div>
                        <small className="small">
                          {errors["confirmPassword"]}{" "}
                        </small>
                      </div>
                      <div
                        className={
                          errors["address"] ? "error form-field" : "form-field"
                        }
                      >
                        <input
                          type="text"
                          value={user?.address}
                          name="address"
                          onChange={handleChnage}
                          placeholder="address"
                        />
                        <small className="small">{errors["address"]}</small>
                      </div>
                    </div>
                    <div className="grid-full">
                      <button
                        className="btn"
                        onClick={(e) => onUpdateProfile(e)}
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </React.Fragment>
  );
}
