import LoginRegisterGrid from "../component/loginRegisterGrid";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        {
          email,
          password,
        }
      );

      const {
        access_token,
        refresh_token,
        access_token_expired_at,
        refresh_token_expired_at,
      } = response.data;

      Cookies.set("accessToken", access_token, {
        expires: new Date(access_token_expired_at),
      });
      Cookies.set("refreshToken", refresh_token, {
        expires: new Date(refresh_token_expired_at),
      });

      setEmail("");
      setPassword("");

      console.log("Success Login");
    } catch (error) {
      if (error.response.data.message === "unauthorized") {
        setError("wrong email or password");
      } else {
        setError(error.response.data.message);
      }
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 h-screen w-full">
      <LoginRegisterGrid />
      <div className="flex flex-col justify-center col-span-3 sm:col-span-3">
        <form
          className="max-w-[400px] w-full mx-auto bg-white p-4"
          onSubmit={handleSubmit}
        >
          <h2 className="text-4xl font-bold text-center py-6">LOGIN</h2>
          <div className="flex flex-col py-2">
            <label>Email</label>
            <input
              className="border p-2"
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="flex flex-col py-2">
            <label>Password</label>
            <input
              className="border p-2"
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
            {error && <div className="text-red-500 py-2">{error}</div>}
          </div>
          <button
            className="border w-full my-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
            type="submit"
          >
            Sign In
          </button>
          <div className="flex justify-between">
            <p className="flex items-center">
              <input className="mr-2" type="checkbox" /> Remember Me
            </p>
            <p>Forgot Password</p>
          </div>
        </form>
      </div>
    </div>
  );
}
