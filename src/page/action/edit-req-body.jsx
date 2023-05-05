import React, { useEffect, useState } from "react";
import { Button, Modal } from "flowbite-react";
import Navbar from "../../component/navbar";
import SidebarNav from "../../component/sidebar";
import useAxios from "../../interceptor/useAxios";
import { useParams } from "react-router-dom";

export default function EditActionReqBodyPage() {
  const { id, method } = useParams();
  const [deleteActionId, setDeleteActionId] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  let api = useAxios();

  const [selectedReqBody, setSelectedReqBody] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        let response;
        if (method === "POST") {
          response = await api.get(
            `${process.env.REACT_APP_API_URL}/action/http/${id}/req?method=POST`
          );
        } else {
          response = await api.get(
            `${process.env.REACT_APP_API_URL}/action/http/${id}/req?method=PUT`
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

  const handleEdit = async (action) => {
    try {
      const payload = {
        req_name: action.req_name,
        data_type: action.data_type,
      };
      await api.put(
        `${process.env.REACT_APP_API_URL}/action/http/${id}/req/${action.id}`,
        payload
      );
      // Do something with the response if needed
      console.log("success update req body");
    } catch (error) {
      console.error(error);
    }
  };

  const onClickDelete = (index) => {
    setDeleteIndex(index);
    const userIdToDelete = selectedReqBody[index].id;
    setDeleteActionId(userIdToDelete);
  };

  const handleDelete = async () => {
    try {
      await api.delete(
        `${process.env.REACT_APP_API_URL}/action/http/${id}/req/${deleteActionId}`
      );
      // Success message or redirect to table page
      console.log("success delete Req Body");
      setSelectedReqBody((prevData) =>
        prevData.filter((action, index) => index !== deleteIndex)
      );
    } catch (error) {
      console.log(error);
      // Error message
    } finally {
      setDeleteActionId(null);
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
                <div className="max-w-[400px] w-full mx-auto bg-white p-4">
                  <h2 className="text-4xl font-bold text-center py-6">
                    Ubah Request Body Action
                  </h2>
                  <a href={`/action/edit/${id}/req/${method}/add`}>
                    <Button>Add Req Body</Button>
                  </a>
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
                          onChange={(event) => {
                            const updatedReqBody = selectedReqBody.map((item) =>
                              item.id === action.id
                                ? { ...item, req_name: event.target.value }
                                : item
                            );
                            setSelectedReqBody(updatedReqBody);
                          }}
                        />
                        <select
                          className="border p-2"
                          type="text"
                          name="req_name"
                          value={action.data_type}
                          onChange={(event) => {
                            const updatedReqBody = selectedReqBody.map((item) =>
                              item.id === action.id
                                ? { ...item, data_type: event.target.value }
                                : item
                            );
                            setSelectedReqBody(updatedReqBody);
                          }}
                        >
                          <option value="STRING">String</option>
                          <option value="INT">Int</option>
                          <option value="FLOAT">Float</option>
                          <option value="DATE">Date</option>
                        </select>
                        <Button
                          onClick={() => handleEdit(action)}
                          className="ml-2 mr-2"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => onClickDelete(index)}
                          className="ml-2 mr-2"
                        >
                          Delete
                        </Button>
                      </div>
                    ))
                  )}
                </div>
                <Modal
                  show={deleteActionId !== null}
                  size="md"
                  popup={true}
                  onClose={() => setDeleteActionId(null)}
                >
                  <Modal.Header />
                  <Modal.Body>
                    <div className="text-center">
                      <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete this product?
                      </h3>
                      <div className="flex justify-center gap-4">
                        <Button color="failure" onClick={handleDelete}>
                          Yes, I'm sure
                        </Button>
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
