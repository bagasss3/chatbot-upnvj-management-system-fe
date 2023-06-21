import LoginRegisterGrid from "../component/loginRegisterGrid";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import iconKirim from "../asset/icon-kirim.svg";
import { Helmet } from "react-helmet";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/forgot-password`,
        {
          email,
        }
      );

      setEmail("");
      console.log("Success Forgot Password");
      if (response.data) {
        navigate("/forgot-password/success");
      }
    } catch (error) {
      if (error.response.statusText === "Bad Request") {
        const errorData = JSON.parse(error.response.data.message);
        const errorMessages = Object.entries(errorData).map(
          ([key, value]) => `- ${key} ${value}`
        );
        setError(errorMessages);
      } else {
        if (error.response.data.message === "unauthorized") {
          setError("wrong email or password");
        } else {
          setError(error.response.message);
        }
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
        <title>Forgot Password</title>
      </Helmet>
      <LoginRegisterGrid />
      <div className="flex flex-col justify-center col-span-3 sm:col-span-3">
        <form
          className="max-w-[400px] w-full mx-auto bg-white p-4"
          onSubmit={handleSubmit}
        >
          <h2 className="text-4xl font-bold text-center py-6">
            Forgot Password?
          </h2>
          <h5 className="text-4l font-text-center py-6">
            Enter your registered email and we will send an email with your new
            password
          </h5>
          <img src={iconKirim} alt="" className="w-30" />
          <div className="flex flex-col py-2">
            <input
              className="border p-2"
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
            />
            {error && (
              <div className="text-red-500 py-2">
                {Array.isArray(error)
                  ? error.map((message, index) => (
                      <div key={index}>{message}</div>
                    ))
                  : error}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="border w-full my-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Send Email"}
          </button>
          <div className="flex justify-between">
            <p className="text-center mx-auto">
              Remember your password?{" "}
              <a href="/login" className="text-blue-500 hover:text-blue-700">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
