import React, { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import Navbar from "../../component/navbar";
import SidebarNav from "../../component/sidebar";
import useAxios from "../../interceptor/useAxios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function EditActionReqBodyPage() {
  const { id, method } = useParams();
  const [selectedReqBody, setSelectedReqBody] = useState([]);

  const [postFields, setPostFields] = useState([]);
  const [putFields, setPutFields] = useState([]);
  const [deleteFields, setDeleteFields] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  let api = useAxios();
  const navigate = useNavigate();

  const handleAddPostField = () => {
    let newFields;
    if (method === "GET") {
      newFields = [...postFields, { req_name: "" }];
    } else {
      newFields = [...postFields, { req_name: "", data_type: "string" }];
    }

    setPostFields(newFields);
  };

  const handlePostChange = (index, event) => {
    console.log(event.target.name);
    const newFields = [...postFields];
    newFields[index][event.target.name] = event.target.value;
    setPostFields(newFields);
  };

  const handlePutChange = (index, event) => {
    const newFields = [...selectedReqBody];
    newFields[index][event.target.name] = event.target.value;
    setSelectedReqBody(newFields);

    const newUpdatedReqBody = [...putFields, selectedReqBody[index]];
    setPutFields(newUpdatedReqBody);
  };

  const handleDeletePostField = (index) => {
    const newFields = [...postFields];
    newFields.splice(index, 1);
    setPostFields(newFields);
  };

  const handleDeletePutField = (index) => {
    const deletedField = [...deleteFields, selectedReqBody[index]];
    setDeleteFields(deletedField);

    const newFieldsReq = [...selectedReqBody];
    newFieldsReq.splice(index, 1);
    setSelectedReqBody(newFieldsReq);

    const newFields = [...putFields];
    newFields.splice(index, 1);
    setPutFields(newFields);
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        let response;
        switch (method) {
          case "POST":
            response = await api.get(
              `${process.env.REACT_APP_API_URL}/action/http/${id}/req?method=POST`
            );
            break;
          case "PUT":
            response = await api.get(
              `${process.env.REACT_APP_API_URL}/action/http/${id}/req?method=PUT`
            );
            break;
          default:
            response = await api.get(
              `${process.env.REACT_APP_API_URL}/action/http/${id}/req?method=GET`
            );
        }

        setSelectedReqBody(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [api, id, method]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (putFields.length > 0) {
        for (let index = 0; index < putFields.length; index++) {
          const payload = {
            req_name: putFields[index].req_name,
            data_type: putFields[index].data_type,
          };
          await api.put(
            `${process.env.REACT_APP_API_URL}/action/http/${id}/req/${putFields[index].id}`,
            payload
          );
        }
      }

      setPutFields([]);

      if (postFields.length > 0) {
        let payload = {
          action_http_id: id,
        };
        switch (method) {
          case "GET":
            payload["get_fields"] = postFields;
            break;
          case "POST":
            payload["post_fields"] = postFields;
            break;
          default:
            payload["put_fields"] = postFields;
        }
        await api.post(
          `${process.env.REACT_APP_API_URL}/action/http/req`,
          payload
        );
      }
      setPostFields([]);

      if (deleteFields.length > 0) {
        for (let index = 0; index < deleteFields.length; index++) {
          await api.delete(
            `${process.env.REACT_APP_API_URL}/action/http/${id}/req/${deleteFields[index].id}`
          );
        }
      }
      setDeleteFields([]);
      // Do something with the response if needed
      console.log("success update req body");
      navigate(`/action/edit/${id}`);
    } catch (error) {
      console.error(error);
      setError(error.response.data.message);
      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

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
                    Ubah Request Body Action Method {method}
                  </h2>
                  <Button onClick={handleAddPostField}>Add Req Body</Button>
                  {isLoading ? (
                    <h2 className="text-2xl font-normal py-6 ml-3">
                      Loading ...
                    </h2>
                  ) : (
                    selectedReqBody.map((action, index) => (
                      <div className="flex flex-row py-2" key={index}>
                        <input
                          className="border p-2 mr-2"
                          type="text"
                          name="req_name"
                          value={action.req_name}
                          onChange={(event) => handlePutChange(index, event)}
                        />
                        {method !== "GET" && (
                          <select
                            className="border p-2"
                            type="text"
                            name="data_type"
                            value={action.data_type}
                            onChange={(event) => handlePutChange(index, event)}
                          >
                            <option value="STRING">String</option>
                            <option value="INT">Int</option>
                            <option value="FLOAT">Float</option>
                            <option value="DATE">Date</option>
                          </select>
                        )}

                        <Button
                          onClick={() => handleDeletePutField(index)}
                          className="ml-2 mr-2"
                        >
                          Delete
                        </Button>
                      </div>
                    ))
                  )}
                  {postFields.map((field, index) => (
                    <div className="flex flex-row py-2" key={index}>
                      <input
                        className="border p-2 mr-2"
                        type="text"
                        name="req_name"
                        value={field.req_name}
                        onChange={(event) => handlePostChange(index, event)}
                        placeholder="Enter Field Name"
                      />
                      {method !== "GET" && (
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
                      )}
                      <Button
                        type="button"
                        onClick={() => handleDeletePostField(index)}
                        className="ml-2 mr-2"
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                  {error && <div className="text-red-500 py-2">{error}</div>}
                  <button
                    className="border w-full my-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
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
