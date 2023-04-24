import React, { useState } from "react";
import Navbar from "../component/navbar";
import SidebarNav from "../component/sidebar";
import useAxios from "../interceptor/useAxios";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  let api = useAxios();

  function handleOldPasswordChange(e) {
    setOldPassword(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleRePasswordChange(e) {
    setRePassword(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let payload = {
        oldpassword: oldPassword,
        password,
        repassword: rePassword,
      };

      const response = await api.put(
        `${process.env.REACT_APP_API_URL}/user/profile`,
        payload
      );
      if (!response.data) {
        throw new Error(response.data.message);
      }

      setOldPassword("");
      setPassword("");
      setRePassword("");

      console.log("Success Change Password");
      navigate("/profile");
    } catch (error) {
      if (error.response.data.message === "unauthorized") {
        setError("wrong current password");
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
    <div>
      <Navbar />
      <SidebarNav />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="grid grid-cols-2 gap-4 mb-4"></div>
          <div className="grid grid-cols-6 gap-4">
            <div className="col-start-2 col-span-4 ...">
              <div className="flex flex-col items-center">
                <form
                  className="max-w-[400px] w-full mx-auto bg-white p-4"
                  onSubmit={handleSubmit}
                >
                  <h2 className="text-4xl font-bold text-center py-6">
                    Ubah Password
                  </h2>
                  <div className="flex flex-col py-2">
                    <input
                      className="border p-2"
                      id="oldpassword"
                      type="password"
                      value={oldPassword}
                      onChange={handleOldPasswordChange}
                      placeholder="Enter Old Password"
                    />
                  </div>
                  <div className="flex flex-col py-2">
                    <input
                      className="border p-2"
                      id="password"
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Enter New Password"
                    />
                  </div>
                  <div className="flex flex-col py-2">
                    <input
                      className="border p-2"
                      id="repassword"
                      type="password"
                      value={rePassword}
                      onChange={handleRePasswordChange}
                      placeholder="Re-Enter New Password"
                    />
                    {error && <div className="text-red-500 py-2">{error}</div>}
                  </div>
                  <button
                    className="border w-full my-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Ubah..." : "Ubah Password"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
