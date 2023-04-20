import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ApiPost } from "../helper/services/api";
 


export default function Account() {
  const [input, setInput] = useState({});
  const [errors, setErrors] = useState({});
  const [isLogin, setIsLogin] = useState(true);
  const [passwordType, setPasswordType] = useState("password");
  const [passwordType1, setPasswordType1] = useState("password");

  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);


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
  const navigate = useNavigate();
  let registerUserData = localStorage.getItem("registerUser");
  registerUserData = registerUserData ? JSON.parse(registerUserData) : [];

  function register() {
    setIsLogin(false);
    setInput({});
    setErrors({});
  }

  function login() {
    setIsLogin(true);
    setErrors({});
    setInput({});
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  //password validation
  const validateFrom = () => {
    let error = {};
    const min = 3,
      max = 25;
    const isBetween = (length, min, max) =>
      length < min || length > max ? false : true;
    const isPasswordSecure = (password) => {
      //reguler expression
      const re = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
      );
      return re.test(password);
    };
    //email validation
    const isEmailValid = (email) => {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    };
    if (!input?.password) {
      error["password"] = "Password cannot be blank.";
    } else if (!isPasswordSecure(input?.password)) {
      error["password"] =
        "Password must has at least 8 characters that include at least 1 lowercase character, 1 uppercase characters, 1 number, and 1 special character in (!@#$%^&*)";
    }
    if (!input?.email) {
      error["email"] = "Email cannot be blank.";
    } else if (!isEmailValid(input?.email)) {
      error["email"] = "Email is not valid.";
    }
   
    if (!isLogin) {
     
      if (!input?.username) {
        error["username"] = "Username cannot be blank.";
      } else if (!isBetween(input?.username?.length, min, max)) {
        error[
          "username"
        ] = `Username must be between ${min} and ${max} characters.`;
      }
      if (!input?.confirmPassword) {
        error["confirmPassword"] = "Please enter the password again.";
      } else if (input?.password !== input?.confirmPassword) {
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

  const onLogin = (e) => {
    e.preventDefault();
    if (validateFrom()) {
      console.log(input,"input")
      // cheking user details from database
      ApiPost("user/signin", input)
      .then((res) => {
         setInput({})
         //storing data in local storage for future use
          localStorage.setItem("userData", JSON.stringify(res?.payload?.user));
          localStorage.setItem("token", res?.payload?.token);
          toast.success("Login Successfully.")
          navigate("/");
      })

      .catch((err) => {

        if(err?.code === 400){
          toast.error(err.error);
        }
      })
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (validateFrom()) {
      ApiPost("user/signup", input, )
      .then((res) => {
         setInput({})
          localStorage.setItem("userData", JSON.stringify(res?.payload?.user));
          localStorage.setItem("token", JSON.stringify(res?.payload?.token));
          toast.success("Register Successfully.")
          navigate("/");
      })

      .catch((err) => {

        if(err?.code === 400){
          toast.error(err.error);
        }
      })
    }
  };

  return (
    <React.Fragment>
      <main>
        <div className="container-1">
          <div className="form-box">
            <div className="header-form">
              <h4
                style={{ color: isLogin ? "#28a745" : "white" }}
                onClick={login}
              >
                Login
              </h4>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <h4
                style={{ color: !isLogin ? "#28a745" : "white" }}
                onClick={register}
              >
                Signup
              </h4>
            </div>
            <div className="body-form">
              <form>
              {!isLogin && (
                <div className="input-group mb-3">
                  <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    id="username"
                    autoComplete="off"
                    value={input?.username}
                    onChange={(e) => handleChange(e)}
                  />
                  <small className="error-msg">{errors["username"]}</small>
                </div>
              )}
                
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      placeholder="Email"
                      name="email"
                      id="email"
                      autoComplete="off"
                      value={input?.email}
                      onChange={(e) => handleChange(e)}
                    />
                    <small className="error-msg">{errors["email"]}</small>
                  </div>
              
                <div className="input-group mb-3 input-relative">
                  <input
                    type={passwordType}
                    placeholder="Password"
                    className={errors["password"] ? "error" : ""}
                    name="password"
                    onChange={(e) => handleChange(e)}
                    id="password1"
                    autoComplete="off"
                    value={input?.password}
                  />
                  <div className="position-icons" onClick={togglePassword}>
                    {passwordType !== "text" ? (
                      <i className="fa fa-eye-slash" />
                    ) : (
                      <i className="fa fa-eye" />
                    )}
                  </div>
                  <small className="error-msg">{errors["password"]}</small>
                </div>
                {!isLogin && (
                  <div className="input-group mb-3 input-relative">
                    <input
                      type={passwordType1}
                      placeholder="Confirm-password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={input?.confirmPassword}
                      onChange={(e) => handleChange(e)}
                      autoComplete="off"
                    />
                    <div className="position-icons" onClick={togglePassword1}>
                      {passwordType1 !== "text" ? (
                        <i className="fa fa-eye-slash" />
                      ) : (
                        <i className="fa fa-eye" />
                      )}
                    </div>
                    <small className="error-msg">
                      {errors["confirmPassword"]}
                    </small>
                  </div>
                )}
                <button
                  onClick={(e) => (isLogin ? onLogin(e) : onSubmit(e))}
                  className="btn btn-secondary btn-block"
                >
                  {isLogin ? "LOGIN" : "REGISTER"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}
