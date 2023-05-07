import React, { useState } from "react";
import { Button } from "flowbite-react";
import Navbar from "../../component/navbar";
import SidebarNav from "../../component/sidebar";
import useAxios from "../../interceptor/useAxios";
import { useNavigate, useParams } from "react-router-dom";

export default function AddActionReqBodyPage() {
  const { id, method } = useParams();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  let api = useAxios();

  const [postFields, setPostFields] = useState([]);

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

  const handleDeletePostField = (index) => {
    const newFields = [...postFields];
    newFields.splice(index, 1);
    setPostFields(newFields);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
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
      console.log(payload);
      await api.post(
        `${process.env.REACT_APP_API_URL}/action/http/req`,
        payload
      );

      setPostFields([]);
      console.log("Success Add Action Req Body");
      navigate(`/action/edit/${id}/req/${method}`);
    } catch (error) {
      console.log(error);
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
                    Tambah Req Body
                  </h2>
                  <Button onClick={handleAddPostField}>Add Req Body</Button>
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

                      <button
                        type="button"
                        onClick={() => handleDeletePostField(index)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  {postFields.length > 0 && (
                    <button
                      className="border w-full my-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Tambah Req Body..." : "Tambah Req Body"}
                    </button>
                  )}

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
