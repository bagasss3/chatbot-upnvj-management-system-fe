import React, { useState } from "react";
import Navbar from "../../component/navbar";
import SidebarNav from "../../component/sidebar";
import useAxios from "../../interceptor/useAxios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function AddStoryPage() {
  const [storyTitle, setStoryTitle] = useState("");
  const [stepFields, setStepFields] = useState([]);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputIntentOptions, setInputIntentOptions] = useState([]);
  const [inputUtteranceOptions, setUtteranceOptions] = useState([]);
  const [inputActionOptions, setActionOptions] = useState([]);
  const navigate = useNavigate();
  let api = useAxios();

  function handleStoryTitleChange(e) {
    setStoryTitle(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let payload = {
        story_title: storyTitle,
      };

      const response = await api.post(
        `${process.env.REACT_APP_API_URL}/story`,
        payload
      );

      const payloadStep = {
        story_id: response.data.id,
        step_fields: stepFields,
      };
      await api.post(
        `${process.env.REACT_APP_API_URL}/story/step`,
        payloadStep
      );

      console.log("Success Add Story");
      navigate("/conversation");
    } catch (error) {
      if (error.response.data.message === "unauthorized") {
        setError("no permission to add intent");
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

  async function handleInputTypeSelect(type) {
    try {
      let newSteps, response;
      newSteps = [...stepFields, { story_id: "", response_id: "", type }];
      switch (type) {
        case "INTENT":
          response = await api.get(`${process.env.REACT_APP_API_URL}/intent`);
          setInputIntentOptions(response.data);
          break;
        case "UTTERANCE":
          response = await api.get(
            `${process.env.REACT_APP_API_URL}/utterance`
          );
          setUtteranceOptions(response.data);
          break;
        default:
          response = await api.get(
            `${process.env.REACT_APP_API_URL}/action/http`
          );
          setActionOptions(response.data);
      }

      setStepFields(newSteps);
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

  const handleOptionInput = (index, event) => {
    console.log(event.target.name);
    const newFields = [...stepFields];
    newFields[index][event.target.name] = event.target.value;
    setStepFields(newFields);
  };

  const handleDeleteStepField = (index) => {
    const newFields = [...stepFields];
    newFields.splice(index, 1);
    setStepFields(newFields);
  };

  return (
    <div>
      <Helmet>
        <title>Add Story</title>
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
                    Tambah Story
                  </h2>
                  <div className="flex flex-col py-2">
                    <input
                      className="border p-2"
                      id="name"
                      type="text"
                      value={storyTitle}
                      onChange={handleStoryTitleChange}
                      placeholder="Enter Story Name"
                    />
                  </div>
                  {stepFields.length > 0 &&
                    stepFields.map((step, index) => (
                      <div className="flex justify-between py-2">
                        <select
                          className="border p-2 flex-grow mr-2"
                          id="response_id"
                          name="response_id"
                          value={step.response_id}
                          onChange={(event) => handleOptionInput(index, event)}
                        >
                          <option value="" disabled>
                            {`Select ${step.type}`}
                          </option>
                          {step.type === "UTTERANCE" &&
                            inputUtteranceOptions.map((input) => (
                              <option key={input.id} value={input.id}>
                                {input.name}
                              </option>
                            ))}
                          {step.type === "INTENT" &&
                            inputIntentOptions
                              .filter((input) => input.id !== "1")
                              .map((input) => (
                                <option key={input.id} value={input.id}>
                                  {input.name}
                                </option>
                              ))}
                          {step.type === "ACTION_HTTP" &&
                            inputActionOptions.map((input) => (
                              <option key={input.id} value={input.id}>
                                {input.name}
                              </option>
                            ))}
                        </select>
                        <button
                          className="border py-1 px-2 bg-red-600 hover:bg-red-500 text-white"
                          type="button"
                          onClick={() => handleDeleteStepField(index)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  <div className="flex gap-4 py-2">
                    <button
                      className="border py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white"
                      type="button"
                      onClick={() => handleInputTypeSelect("INTENT")}
                    >
                      Intent
                    </button>
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
                  {error && <div className="text-red-500 py-2">{error}</div>}
                  <button
                    className="border w-full my-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Tambah Story..." : "Tambah Story"}
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
