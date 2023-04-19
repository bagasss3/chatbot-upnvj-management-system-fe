import LoginRegisterGrid from "../component/loginRegisterGrid";
import React from "react";
import iconSuccessForgotPass from "../asset/icon-sukses.svg";

export default function SuccessForgotPasswordPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 h-screen w-full">
      <LoginRegisterGrid />
      <div className="flex flex-col justify-center col-span-3 sm:col-span-3">
        <div className="max-w-[400px] w-full mx-auto bg-white p-4">
          <h2 className="text-4xl font-bold text-center py-6">Email Sent</h2>
          <h5 className="text-4l text-center py-6">Check your email</h5>
          <img src={iconSuccessForgotPass} alt="" className="w-30" />
          <a href="/login">
            <button
              className="border w-full my-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
              type="submit"
            >
              Sign in
            </button>
          </a>
          <div className="flex justify-between">
            <p className="text-center mx-auto">
              Haven't receive the email yet?{" "}
              <a
                href="/forgot-password"
                className="text-blue-500 hover:text-blue-700"
              >
                Resend
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
