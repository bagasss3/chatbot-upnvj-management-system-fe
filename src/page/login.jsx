import LoginRegisterGrid from "../component/loginRegisterGrid";
import React, { useState, useContext } from "react";
import AuthContext from "../component/shared/AuthContext";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let payload = {
        email,
        password,
      };

      await login(payload);

      setEmail("");
      setPassword("");

      console.log("Success Login");
      navigate("/");
    } catch (error) {
      if (error.response.data.message === "unauthorized") {
        setError("wrong email or password");
      } else {
        setError(error.response.data.message);
      }
      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 h-screen w-full">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <LoginRegisterGrid />
      <div className="flex flex-col justify-center col-span-3 sm:col-span-3">
        <form
          className="max-w-[400px] w-full mx-auto bg-white p-4"
          onSubmit={handleSubmit}
        >
          <h2 className="text-4xl font-bold text-center py-6">LOGIN</h2>
          <div className="flex flex-col py-2">
            <input
              className="border p-2"
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter Email"
            />
          </div>
          <div className="flex flex-col py-2">
            <input
              className="border p-2"
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter password"
            />
            {error && <div className="text-red-500 py-2">{error}</div>}
          </div>
          <button
            className="border w-full my-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Sign in..." : "Sign in"}
          </button>
          <div className="flex justify-between">
            <p className="flex items-center">
              <input className="mr-2" type="checkbox" /> Remember Me
            </p>
            <a
              href="/forgot-password"
              className="text-blue-500 hover:text-blue-700"
            >
              <p>Forgot Password</p>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
