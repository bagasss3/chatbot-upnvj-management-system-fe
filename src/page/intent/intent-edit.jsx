import React, { useState, useEffect } from "react";
import Navbar from "../../component/navbar";
import SidebarNav from "../../component/sidebar";
import useAxios from "../../interceptor/useAxios";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function EditIntentPage() {
  const { id } = useParams();

  const [name, setName] = useState("");
  const [isInformationAcademics, setIsInformationAcademics] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  let api = useAxios();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await api.get(
          `${process.env.REACT_APP_API_URL}/intent/${id}`
        );
        const data = response.data;
        setName(data.name);
        setIsInformationAcademics(data.is_information_academic);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [api, id]);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleInformationAcademicsChange(e) {
    setIsInformationAcademics(e.target.checked);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let payload = {
        name,
        is_information_academic: isInformationAcademics,
      };
      console.log("payload:", payload);
      await api.put(`${process.env.REACT_APP_API_URL}/intent/${id}`, payload);
      setName("");
      setIsInformationAcademics(false);

      console.log("Success Edit Intent");
      navigate("/intent");
    } catch (error) {
      if (error.response.statusText === "Bad Request") {
        const errorData = JSON.parse(error.response.data.message);
        const errorMessages = Object.entries(errorData).map(
          ([key, value]) => `- ${key} ${value}`
        );
        setError(errorMessages);
      } else {
        if (error.response.data.message === "unauthorized") {
          setError("no permission to edit intent");
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
    <div>
      <Helmet>
        <title>Edit Intent</title>
      </Helmet>
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
                    Ubah Intent
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
                  <div className="flex items-center py-2">
                    <input
                      className="mr-2"
                      id="isInformaticAcademics"
                      type="checkbox"
                      checked={isInformationAcademics}
                      onChange={handleInformationAcademicsChange}
                    />
                    <label htmlFor="isInformationAcademics">
                      Information Academic
                    </label>
                  </div>
                  {error && (
                    <div className="text-red-500 py-2">
                      {Array.isArray(error)
                        ? error.map((message, index) => (
                            <div key={index}>{message}</div>
                          ))
                        : error}
                    </div>
                  )}
                  <button
                    className="border w-full my-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Ubah Intent..." : "Ubah Intent"}
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
