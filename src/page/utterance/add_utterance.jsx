import React, { useState } from "react";
import Navbar from "../../component/navbar";
import SidebarNav from "../../component/sidebar";
import useAxios from "../../interceptor/useAxios";
import { useNavigate } from "react-router-dom";

export default function AddUtterancePage() {
  const [name, setName] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  let api = useAxios();

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleResponseChange(e) {
    setResponse(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let payload = {
        name,
        response,
      };

      await api.post(`${process.env.REACT_APP_API_URL}/utterance`, payload);
      setName("");
      setResponse("");

      console.log("Success Add Utterance");
      navigate("/utterance");
    } catch (error) {
      if (error.response.data.message === "unauthorized") {
        setError("no permission to add admin");
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
                    Tambah Utterance
                  </h2>
                  <div className="flex flex-col py-2">
                    <input
                      className="border p-2"
                      id="name"
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      placeholder="Enter Utterance Name"
                    />
                  </div>
                  <div className="flex flex-col py-2">
                    <textarea
                      className="border p-2"
                      id="response"
                      type="text"
                      value={response}
                      onChange={handleResponseChange}
                      placeholder="Enter Response"
                    />
                  </div>
                  {error && <div className="text-red-500 py-2">{error}</div>}
                  <button
                    className="border w-full my-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Tambah Admin..." : "Tambah Admin"}
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
