import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Cookies from "js-cookie";
import { toast } from "sonner";

export const Auth = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [, setCookies] = useCookies(["access_token"]);
  const [isSignIN, setIsSignIN] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (Cookies.get("access_token")) {
      setIsSignIN(true);
    }

    if (isSignIN) {
      navigate("/dashboard");
    }
  }, [isSignIN, navigate]);

  const cleared = () => {
    setUsername("");
    setPassword("");
    setConfirmPass("");
  };

  const handleSignupClick = () => {
    setIsLoginForm(false);
    cleared();
  };

  const handleLoginClick = () => {
    setIsLoginForm(true);
    cleared();
  };

  const handleSignupLinkClick = (e) => {
    e.preventDefault();
    handleSignupClick();
  };

  const LoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const res = await axios.post(`http://localhost:3001/user/login`, {
        username,
        password,
      });

      if (res.data.success === true) {
        setCookies("access_token", res.data.token, {
          path: "/",
        });
        localStorage.setItem("userID", res.data.userId);
        toast.success("✅ Login successful"); 
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        if (res.data.message === "Incorrect password. Please try again.") {
          toast.error("❌ Wrong password");
        } else if (res.data.message === "User not found. Please sign up.") {
          toast.warning("⚠️ User not found");
        } else {
          toast(res.data.message || "Login failed.");
        }
      }
    } catch (err) {
      console.error("Login Error:", err);
      toast.error("🚫 Server error. Please try again later.");
    }

    setLoading(false);
  };

  const SignUpSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPass)
      return toast.warning("⚠️ Confirm password doesn't match!");

    setLoading(true);

    try {
      const res = await axios.post(`http://localhost:3001/user/create`, {
        username,
        password,
      });

      if (res.data.success === true) {
        handleLoginClick();
        toast.success("🎉 Account created! Please log in.");
      } else {
        toast.warning(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("🚫 Signup failed. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="wrapper" style={{ border: "3px solid black" }}>
      <div className="title-text">
        <div className={`title ${isLoginForm ? "login" : "signup"}`}>
          {isLoginForm ? "SHUBZ I VERSE" : "SHUBZ I VERSE"}
        </div>
      </div>
      <div className="form-container">
        <div className="slide-controls">
          <input
            type="radio"
            name="slide"
            id="login"
            checked={isLoginForm}
            onChange={handleLoginClick}
          />
          <input
            type="radio"
            name="slide"
            id="signup"
            checked={!isLoginForm}
            onChange={handleSignupClick}
          />
          <label
            htmlFor="login"
            className={`slide login ${isLoginForm ? "active" : ""}`}
          >
            Login
          </label>
          <label
            htmlFor="signup"
            className={`slide signup ${!isLoginForm ? "active" : ""}`}
          >
            Signup
          </label>
          <div className="slider-tab"></div>
        </div>
        <div className="form-inner">
          {isLoginForm ? (
            <form onSubmit={LoginSubmit} className="login">
              <div className="field">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input
                  type="submit"
                  value={loading ? "Logging in..." : "Login"}
                  disabled={loading}
                />
              </div>
              <div className="signup-link">
                Not a member?{" "}
                <p onClick={handleSignupLinkClick} className="p-link">
                  Signup now
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={SignUpSubmit} className="signup">
              <div className="field">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  required
                />
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input
                  type="submit"
                  value={loading ? "Creating..." : "Signup"}
                  disabled={loading}
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
