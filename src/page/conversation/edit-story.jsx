import React, { useState, useEffect } from "react";
import Navbar from "../../component/navbar";
import SidebarNav from "../../component/sidebar";
import useAxios from "../../interceptor/useAxios";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function EditStoryPage() {
  const { id } = useParams();

  const [storyTitle, setStoryTitle] = useState("");
  const [stepFields, setStepFields] = useState([]);
  const [updateStepFields, setUpdateStepFields] = useState([]);
  const [deleteStepFields, setDeleteStepFields] = useState([]);

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

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await api.get(
          `${process.env.REACT_APP_API_URL}/story/${id}`
        );
        setStoryTitle(response.data.story_title);

        const responseApi = await api.get(
          `${process.env.REACT_APP_API_URL}/story/${id}/step`
        );
        setUpdateStepFields(responseApi.data);

        const responseIntent = await api.get(
          `${process.env.REACT_APP_API_URL}/intent`
        );
        setInputIntentOptions(responseIntent.data);

        const responseUtterance = await api.get(
          `${process.env.REACT_APP_API_URL}/utterance`
        );
        setUtteranceOptions(responseUtterance.data);

        const responseAction = await api.get(
          `${process.env.REACT_APP_API_URL}/action/http`
        );
        setActionOptions(responseAction.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [api, id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let payload = {
        story_title: storyTitle,
      };

      await api.put(`${process.env.REACT_APP_API_URL}/story/${id}`, payload);

      if (stepFields.length > 0) {
        const payloadStep = {
          story_id: id,
          step_fields: stepFields,
        };
        await api.post(
          `${process.env.REACT_APP_API_URL}/story/step`,
          payloadStep
        );
        console.log("Success Save Steps");
      }

      if (updateStepFields.length > 0) {
        for (let index = 0; index < updateStepFields.length; index++) {
          const payload = {
            response_id: updateStepFields[index].response_id,
            type: updateStepFields[index].type,
          };
          await api.put(
            `${process.env.REACT_APP_API_URL}/story/${id}/step/${updateStepFields[index].id}`,
            payload
          );
        }
        console.log("Success Update Steps");
      }

      if (deleteStepFields.length > 0) {
        for (let index = 0; index < deleteStepFields.length; index++) {
          await api.delete(
            `${process.env.REACT_APP_API_URL}/story/${id}/step/${deleteStepFields[index].id}`
          );
        }
        console.log("Success Delete Steps");
      }

      console.log("Success Edit Story");
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
          setError("no permission to edit story");
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
    try {
      let newSteps;
      newSteps = [...stepFields, { story_id: "", response_id: "", type }];
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

  const handleExistingInput = (index, event) => {
    const newFields = [...updateStepFields];
    newFields[index][event.target.name] = event.target.value;
    setUpdateStepFields(newFields);
  };

  const handleDeleteStepField = (index) => {
    const newFields = [...stepFields];
    newFields.splice(index, 1);
    setStepFields(newFields);
  };

  const handleDeleteExistingStepField = (index) => {
    const deletedField = [...deleteStepFields, updateStepFields[index]];
    setDeleteStepFields(deletedField);

    const newFields = [...updateStepFields];
    newFields.splice(index, 1);
    setUpdateStepFields(newFields);
  };

  return (
    <div>
      <Helmet>
        <title>Edit Story</title>
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
                    Ubah Story
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
                  {updateStepFields.length > 0 &&
                    updateStepFields.map((step, index) => (
                      <div className="flex justify-between py-2">
                        <select
                          className="border p-2 flex-grow mr-2"
                          id="response_id"
                          name="response_id"
                          value={step.response_id}
                          onChange={(event) =>
                            handleExistingInput(index, event)
                          }
                        >
                          {inputUtteranceOptions.length <= 0 ? (
                            <option value="" disabled selected>
                              {`Select ${step.type}`}
                            </option>
                          ) : (
                            <option value="" disabled>
                              {`Select ${step.type}`}
                            </option>
                          )}
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
                          onClick={() => handleDeleteExistingStepField(index)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
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
                            inputIntentOptions.map((input) => (
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
                    {isLoading ? "Ubah Story..." : "Ubah Story"}
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
