import React, { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import Navbar from "../../component/navbar";
import SidebarNav from "../../component/sidebar";
import useAxios from "../../interceptor/useAxios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditActionPage() {
  const { id } = useParams();

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

  const [, setPostFields] = useState([]);
  const [, setPutFields] = useState([]);
  const [selectedReqBodyGet, setSelectedReqBodyGet] = useState([]);
  const [selectedReqBodyPost, setSelectedReqBodyPost] = useState([]);
  const [selectedReqBodyPut, setSelectedReqBodyPut] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await api.get(
          `${process.env.REACT_APP_API_URL}/action/http/${id}`
        );
        const data = response.data;
        console.log(data);
        setName(data.name);
        setApiKey(data.api_key);
        setDelHttpReq(data.del_http_req);
        setGetHttpReq(data.get_http_req);
        setPostHttpReq(data.post_http_req);
        setPutHttpReq(data.put_http_req);
        setTextResponse(data.text_response);

        const responseGet = await api.get(
          `${process.env.REACT_APP_API_URL}/action/http/${id}/req?method=GET`
        );
        setSelectedReqBodyGet(responseGet.data);

        if (response.data.post_http_req !== "") {
          const responsePost = await api.get(
            `${process.env.REACT_APP_API_URL}/action/http/${id}/req?method=POST`
          );
          setSelectedReqBodyPost(responsePost.data);
        }

        if (response.data.put_http_req !== "") {
          const responsePut = await api.get(
            `${process.env.REACT_APP_API_URL}/action/http/${id}/req?method=PUT`
          );
          setSelectedReqBodyPut(responsePut.data);
        }
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
      await api.put(
        `${process.env.REACT_APP_API_URL}/action/http/${id}`,
        payload
      );

      setName("");
      setGetHttpReq("");
      setPostHttpReq("");
      setPutHttpReq("");
      setDelHttpReq("");
      setApiKey("");
      setTextResponse("");
      console.log("Success Edit Action");
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
                    Ubah Action
                  </h2>
                  <div className="flex flex-col py-2">
                    <label htmlFor="">Name</label>
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
                    <label htmlFor="">Get Http Request</label>
                    <input
                      className="border p-2"
                      id="get_http_request"
                      type="text"
                      value={getHttpReq}
                      onChange={handleGetHttpReqChange}
                      placeholder="Enter Action Name"
                    />
                  </div>
                  <a href={`/action/edit/${id}/req/GET`} className="mt-2">
                    <Button>Edit Get Req Body</Button>
                  </a>
                  {selectedReqBodyGet.map((action, index) => (
                    <div className="flex flex-row py-2" key={index}>
                      <input
                        className="border p-2 mr-2"
                        type="text"
                        name="req_name"
                        value={action.req_name}
                        disabled={true}
                      />
                    </div>
                  ))}
                  <div className="flex flex-col py-2">
                    <label htmlFor="">Post Http Request</label>
                    <input
                      className="border p-2"
                      id="name"
                      type="text"
                      value={postHttpReq}
                      onChange={handlePostHttpReqChange}
                      placeholder="Enter Action Name"
                    />
                    <a href={`/action/edit/${id}/req/POST`} className="mt-2">
                      <Button>Edit Post Req Body</Button>
                    </a>
                    {postHttpReq !== "" &&
                      selectedReqBodyPost.map((action, index) => (
                        <div className="flex flex-row py-2" key={index}>
                          <input
                            className="border p-2 mr-2"
                            type="text"
                            name="req_name"
                            value={action.req_name}
                            disabled={true}
                          />
                          <select
                            className="border p-2"
                            type="text"
                            name="req_name"
                            value={action.data_type}
                            disabled={true}
                          >
                            <option value="STRING">String</option>
                            <option value="INT">Int</option>
                            <option value="FLOAT">Float</option>
                            <option value="DATE">Date</option>
                          </select>
                        </div>
                      ))}
                  </div>
                  <div className="flex flex-col py-2">
                    <label htmlFor="">Put Http Request</label>
                    <input
                      className="border p-2"
                      id="name"
                      type="text"
                      value={putHttpReq}
                      onChange={handlePutHttpReqChange}
                      placeholder="Enter Action Name"
                    />
                    <a href={`/action/edit/${id}/req/PUT`} className="mt-2">
                      <Button>Edit Put Req Body</Button>
                    </a>
                    {putHttpReq !== "" &&
                      selectedReqBodyPut.map((action, index) => (
                        <div className="flex flex-row py-2" key={index}>
                          <input
                            className="border p-2 mr-2"
                            type="text"
                            name="req_name"
                            value={action.req_name}
                            disabled={true}
                          />
                          <select
                            className="border p-2"
                            type="text"
                            name="req_name"
                            value={action.data_type}
                            disabled={true}
                          >
                            <option value="STRING">String</option>
                            <option value="INT">Int</option>
                            <option value="FLOAT">Float</option>
                            <option value="DATE">Date</option>
                          </select>
                        </div>
                      ))}
                  </div>
                  <div className="flex flex-col py-2">
                    <label htmlFor="">Delete Http Request</label>
                    <input
                      className="border p-2"
                      id="name"
                      type="text"
                      value={delHttpReq}
                      onChange={handleDelHttpReqChange}
                      placeholder="Enter Action Name"
                    />
                  </div>
                  <div className="flex flex-col py-2">
                    <label htmlFor="">Api Key</label>
                    <input
                      className="border p-2"
                      id="name"
                      type="text"
                      value={apiKey}
                      onChange={handleApiKeyChange}
                      placeholder="Enter Action Name"
                    />
                  </div>
                  <div className="flex flex-col py-2">
                    <label htmlFor="">Text Response</label>
                    <input
                      className="border p-2"
                      id="name"
                      type="text"
                      value={textResponse}
                      onChange={handleTextResponseChange}
                      placeholder="Enter Action Name"
                    />
                  </div>
                  {error && <div className="text-red-500 py-2">{error}</div>}
                  <button
                    className="border w-full my-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Ubah Action..." : "Ubah Action"}
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
