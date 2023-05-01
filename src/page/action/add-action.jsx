import React, { useState } from "react";
import { Button } from "flowbite-react";
import Navbar from "../../component/navbar";
import SidebarNav from "../../component/sidebar";
import useAxios from "../../interceptor/useAxios";
import { useNavigate } from "react-router-dom";

export default function AddActionPage() {
  const [name, setName] = useState("");
  const [getHttpReq, setGetHttpReq] = useState("");
  const [postHttpReq, setPostHttpReq] = useState("");
  const [putHttpReq, setPutHttpReq] = useState("");
  const [delHttpReq, setDelHttpReq] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [textResponse, setTextResponse] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  let api = useAxios();

  const [postFields, setPostFields] = useState([]);
  const [putFields, setPutFields] = useState([]);

  const handleAddPostField = () => {
    const newFields = [...postFields, { req_name: "", data_type: "string" }];
    setPostFields(newFields);
  };

  const handlePostChange = (index, event) => {
    console.log(event.target.name);
    const newFields = [...postFields];
    newFields[index][event.target.name] = event.target.value;
    setPostFields(newFields);
  };

  const handleDeletePostField = (index) => {
    const newFields = [...postFields];
    newFields.splice(index, 1);
    setPostFields(newFields);
  };

  const handleAddPutField = () => {
    const newFields = [...putFields, { req_name: "", data_type: "string" }];
    setPutFields(newFields);
  };

  const handlePutChange = (index, event) => {
    console.log(event.target.name);
    const newFields = [...putFields];
    newFields[index][event.target.name] = event.target.value;
    setPutFields(newFields);
  };

  const handleDeletePutField = (index) => {
    const newFields = [...putFields];
    newFields.splice(index, 1);
    setPutFields(newFields);
  };

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleGetHttpReqChange(e) {
    setGetHttpReq(e.target.value);
  }

  function handlePostHttpReqChange(e) {
    setPostHttpReq(e.target.value);
    if (postHttpReq === "") {
      setPostFields([]);
    }
  }

  function handlePutHttpReqChange(e) {
    setPutHttpReq(e.target.value);
    if (putHttpReq === "") {
      setPutFields([]);
    }
  }

  function handleDelHttpReqChange(e) {
    setDelHttpReq(e.target.value);
  }

  function handleApiKeyChange(e) {
    setApiKey(e.target.value);
  }

  function handleTextResponseChange(e) {
    setTextResponse(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let payload = {
        name,
        get_http_req: getHttpReq,
        post_http_req: postHttpReq,
        put_http_req: putHttpReq,
        del_http_req: delHttpReq,
        api_key: apiKey,
        text_response: textResponse,
      };
      console.log(payload);
      const response = await api.post(
        `${process.env.REACT_APP_API_URL}/action/http`,
        payload
      );

      if (postHttpReq || putHttpReq) {
        let payload = {
          action_http_id: response.data.id,
          post_fields: postFields,
          put_fields: putFields,
        };

        await api.post(
          `${process.env.REACT_APP_API_URL}/action/http/req`,
          payload
        );
      }
      setName("");
      setGetHttpReq("");
      setPostHttpReq("");
      setPutHttpReq("");
      setDelHttpReq("");
      setApiKey("");
      setTextResponse("");
      setPostFields([]);
      setPutFields([]);
      console.log("Success Add Action");
      navigate("/action");
    } catch (error) {
      if (error.response.data.message === "unauthorized") {
        setError("no permission to add action");
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
                    Tambah Action
                  </h2>
                  <div className="flex flex-col py-2">
                    <input
                      className="border p-2"
                      id="name"
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      placeholder="Enter Action Name"
                    />
                  </div>
                  <div className="flex flex-col py-2">
                    <input
                      className="border p-2"
                      id="getHttpReq"
                      type="text"
                      value={getHttpReq}
                      onChange={handleGetHttpReqChange}
                      placeholder="Enter External Http Request Get Method"
                    />
                  </div>
                  <div className="flex flex-col py-2">
                    <input
                      className="border p-2"
                      id="postHttpReq"
                      type="text"
                      value={postHttpReq}
                      onChange={handlePostHttpReqChange}
                      placeholder="Enter External Http Request Post Method"
                    />
                  </div>
                  {postHttpReq && (
                    <Button onClick={handleAddPostField}>Add Req Body</Button>
                  )}
                  {postHttpReq &&
                    postFields.map((field, index) => (
                      <div className="flex flex-row py-2" key={index}>
                        <input
                          className="border p-2 mr-2"
                          type="text"
                          name="req_name"
                          value={field.req_name}
                          onChange={(event) => handlePostChange(index, event)}
                          placeholder="Enter Field Name"
                        />
                        <select
                          className="border p-2"
                          name="data_type"
                          value={field.data_type}
                          onChange={(event) => handlePostChange(index, event)}
                        >
                          <option value="string">String</option>
                          <option value="int">Int</option>
                          <option value="float">Float</option>
                          <option value="date">Date</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleDeletePostField(index)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  <div className="flex flex-col py-2">
                    <input
                      className="border p-2"
                      id="putHttpReq"
                      type="text"
                      value={putHttpReq}
                      onChange={handlePutHttpReqChange}
                      placeholder="Enter External Http Request Put Method"
                    />
                  </div>
                  {putHttpReq && (
                    <Button onClick={handleAddPutField}>Add Req Body</Button>
                  )}
                  {putHttpReq &&
                    putFields.map((field, index) => (
                      <div className="flex flex-row py-2" key={index}>
                        <input
                          className="border p-2 mr-2"
                          type="text"
                          name="req_name"
                          value={field.req_name}
                          onChange={(event) => handlePutChange(index, event)}
                          placeholder="Enter Field Name"
                        />
                        <select
                          className="border p-2"
                          name="data_type"
                          value={field.data_type}
                          onChange={(event) => handlePutChange(index, event)}
                        >
                          <option value="string">String</option>
                          <option value="int">Int</option>
                          <option value="float">Float</option>
                          <option value="date">Date</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleDeletePutField(index)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  <div className="flex flex-col py-2">
                    <input
                      className="border p-2"
                      id="delHttpReq"
                      type="text"
                      value={delHttpReq}
                      onChange={handleDelHttpReqChange}
                      placeholder="Enter External Http Request Del Method"
                    />
                  </div>
                  <div className="flex flex-col py-2">
                    <input
                      className="border p-2"
                      id="apiKey"
                      type="text"
                      value={apiKey}
                      onChange={handleApiKeyChange}
                      placeholder="Enter API Key"
                    />
                  </div>
                  <div className="flex flex-col py-2">
                    <textarea
                      className="border p-2"
                      id="textResponse"
                      type="text"
                      value={textResponse}
                      onChange={handleTextResponseChange}
                      placeholder="Enter Text Response"
                    />
                  </div>
                  <button
                    className="border w-full my-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Tambah Action..." : "Tambah Action"}
                  </button>
                  {error && <div className="text-red-500 py-2">{error}</div>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
