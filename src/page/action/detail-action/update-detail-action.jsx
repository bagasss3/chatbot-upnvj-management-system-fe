import React, { useState, useEffect } from "react";
import Navbar from "../../../component/navbar";
import SidebarNav from "../../../component/sidebar";
import useAxios from "../../../interceptor/useAxios";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function UpdateActionDetailPage() {
  const { id, dataId } = useParams();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  let api = useAxios();

  const [reqBodies, setReqBodies] = useState([]);
  const [formData, setFormData] = useState({});
  const [action, setAction] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseAction = await api.get(
          `${process.env.REACT_APP_API_URL}/action/http/${id}`
        );
        setAction(responseAction.data);
        console.log(responseAction);
        const response = await api.get(
          `${process.env.REACT_APP_API_URL}/action/http/${id}/req?method=POST`
        );
        setReqBodies(response.data);
        console.log(response);

        const responseApi = await api.get(
          responseAction.data.get_http_req + "/" + dataId
        );
        setFormData(responseApi.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [api, id, dataId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put(action.put_http_req + "/" + dataId, formData, {
        headers: {
          API_KEY: action.api_key,
        },
      });

      console.log("Success update Action Detil");
      navigate(`/action/${id}/detail`);
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

  const getInputType = (dataType) => {
    switch (dataType) {
      case "STRING":
        return "text";
      case "INT":
        return "number";
      case "FLOAT":
        return "number";
      case "DATE":
        return "date";
      default:
        return "text";
    }
  };

  return (
    <div>
      <Helmet>
        <title>Update Detail Action</title>
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
                    Ubah Data
                  </h2>
                  {reqBodies.map((field) => (
                    <label key={field.id}>
                      {field.req_name}:
                      <div className="flex flex-col py-2">
                        <input
                          className="border p-2"
                          type={getInputType(field.data_type)}
                          name={field.req_name}
                          value={formData[field.req_name] || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </label>
                  ))}

                  <button
                    className="border w-full my-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Ubah Data..." : "Ubah Data"}
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
