import React, { useState, useEffect } from "react";
import Navbar from "../../component/navbar";
import SidebarNav from "../../component/sidebar";
import useAxios from "../../interceptor/useAxios";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function EditRulePage() {
  const { id } = useParams();

  const [ruleTitle, setRuleTitle] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInputs, setShowInputs] = useState(false);
  const [inputType, setInputType] = useState("");
  const [selectedInput, setSelectedInput] = useState("");
  const [selectedIntentInput, setSelectedIntentInput] = useState("");
  const [inputIntentOptions, setInputIntentOptions] = useState([]);
  const [inputOptions, setInputOptions] = useState([]);
  const navigate = useNavigate();
  let api = useAxios();

  function handleRuleTitleChange(e) {
    setRuleTitle(e.target.value);
  }

  function handleSelectedInput(e) {
    setSelectedInput(e.target.value);
  }

  function handleSelectedIntentInput(e) {
    setSelectedIntentInput(e.target.value);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseApi = await api.get(
          `${process.env.REACT_APP_API_URL}/rule/${id}`
        );
        setRuleTitle(responseApi.data.rule_title);
        setInputType(responseApi.data.type);
        setSelectedIntentInput(responseApi.data.intent_id);
        setSelectedInput(responseApi.data.response_id);

        const response = await api.get(
          `${process.env.REACT_APP_API_URL}/intent`
        );
        console.log(response);
        setInputIntentOptions(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [api, id]);

  useEffect(() => {
    const fetchOptions = async () => {
      let responseOptions;
      if (inputType === "ACTION_HTTP") {
        responseOptions = await api.get(
          `${process.env.REACT_APP_API_URL}/action/http`
        );
      } else {
        responseOptions = await api.get(
          `${process.env.REACT_APP_API_URL}/utterance`
        );
      }
      setInputOptions(responseOptions.data);
      console.log(responseOptions.data);
      setShowInputs(true);
    };
    if (inputType) {
      fetchOptions();
    }
  }, [api, inputType]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log(inputType);
      let payload = {
        rule_title: ruleTitle,
        intent_id: selectedIntentInput,
        response_id: selectedInput,
      };
      if (inputType === "ACTION_HTTP") {
        payload["type"] = "ACTION_HTTP";
      } else {
        payload["type"] = "UTTERANCE";
      }
      console.log(payload);
      const res = await api.put(
        `${process.env.REACT_APP_API_URL}/rule/${id}`,
        payload
      );
      console.log(res);
      setRuleTitle("");
      setSelectedInput("");
      setInputType("");

      console.log("Success Edit Rule");
      navigate("/conversation");
    } catch (error) {
      if (error.response.statusText === "Bad Request") {
        const errorData = JSON.parse(error.response.data.message);
        const errorMessages = Object.entries(errorData).map(
          ([key, value]) => `- ${key} ${value}`
        );
        setError(errorMessages);
      } else {
        if (error.response.data.message === "unauthorized") {
          setError("no permission to edit rule");
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

  async function handleInputTypeSelect(type) {
    setInputType(type);
    try {
      let response;
      if (type === "ACTION_HTTP") {
        response = await api.get(
          `${process.env.REACT_APP_API_URL}/action/http`
        );
      } else {
        response = await api.get(`${process.env.REACT_APP_API_URL}/utterance`);
      }
      setInputOptions(response.data);
      setShowInputs(true);
      console.log(response.data);
    } catch (error) {
      if (error.response.data.message === "unauthorized") {
        setError(`no permission to access ${type} options`);
      } else {
        setError(`error fetching ${type} options`);
      }
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }

  function handleInputDelete() {
    setInputType("");
    setInputOptions([]);
    setShowInputs(false);
    setSelectedInput("");
  }

  return (
    <div>
      <Helmet>
        <title>Edit Rule</title>
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
                    Ubah Rule
                  </h2>
                  <div className="flex flex-col py-2">
                    <input
                      className="border p-2"
                      id="name"
                      type="text"
                      value={ruleTitle}
                      onChange={handleRuleTitleChange}
                      placeholder="Enter Rule Name"
                    />
                  </div>
                  <div className="flex flex-col py-2">
                    <select
                      className="border p-2 flex-grow mr-2"
                      id="input-list"
                      value={selectedIntentInput}
                      onChange={handleSelectedIntentInput}
                      disabled={selectedIntentInput === "1"}
                    >
                      <option value="" disabled>
                        Select Intent
                      </option>
                      {selectedIntentInput === "1"
                        ? inputIntentOptions.map((input) => (
                            <option key={input.id} value={input.id}>
                              {input.name}
                            </option>
                          ))
                        : inputIntentOptions
                            .filter((input) => input.id !== "1")
                            .map((input) => (
                              <option key={input.id} value={input.id}>
                                {input.name}
                              </option>
                            ))}
                    </select>
                  </div>
                  {/* ADD HERE */}
                  {error && (
                    <div className="text-red-500 py-2">
                      {Array.isArray(error)
                        ? error.map((message, index) => (
                            <div key={index}>{message}</div>
                          ))
                        : error}
                    </div>
                  )}
                  {!showInputs && (
                    <div className="flex gap-4 py-2">
                      <button
                        className="border py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white"
                        type="button"
                        onClick={() => handleInputTypeSelect("UTTERANCE")}
                      >
                        Utterance
                      </button>
                      <button
                        className="border py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white"
                        type="button"
                        onClick={() => handleInputTypeSelect("ACTION_HTTP")}
                      >
                        Action
                      </button>
                    </div>
                  )}
                  {showInputs && (
                    <div className="flex justify-between py-2">
                      <select
                        className="border p-2 flex-grow mr-2"
                        id="input-list"
                        value={selectedInput}
                        onChange={handleSelectedInput}
                      >
                        {inputOptions.length <= 0 ? (
                          <option value="" disabled selected>
                            Select option
                          </option>
                        ) : (
                          <option value="" disabled>
                            Select option
                          </option>
                        )}
                        {inputOptions.map((input) => (
                          <option key={input.id} value={input.id}>
                            {input.name}
                          </option>
                        ))}
                      </select>
                      <button
                        className="border py-1 px-2 bg-red-600 hover:bg-red-500 text-white"
                        type="button"
                        onClick={handleInputDelete}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  <button
                    className="border w-full my-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Ubah Rule..." : "Ubah Rule"}
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
