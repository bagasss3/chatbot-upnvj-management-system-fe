import React, { useState, useEffect } from "react";
import { Button, Table, Modal } from "flowbite-react";
import Navbar from "../../component/navbar";
import SidebarNav from "../../component/sidebar";
import useAxios from "../../interceptor/useAxios";
import SearchComponent from "../../component/searchbar";
import { Helmet } from "react-helmet";

export default function ActionPage() {
  const [actionData, setActionData] = useState([]);
  const [deleteActionId, setDeleteActionId] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [selectedActionData, setSelectedActionData] = useState(null);
  const [selectedReqBodyPost, setSelectedReqBodyPost] = useState([]);
  const [selectedReqBodyPut, setSelectedReqBodyPut] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  let api = useAxios();

  function handleSearchTermChange(e) {
    setSearchTerm(e.target.value);
  }

  const onClickDelete = (index) => {
    setDeleteIndex(index);
    const userIdToDelete = actionData[index].id;
    setDeleteActionId(userIdToDelete);
  };

  const onClickActionName = async (index) => {
    const action = actionData[index];
    try {
      const response = await api.get(
        `${process.env.REACT_APP_API_URL}/action/http/${action.id}`
      );
      setSelectedActionData(response.data);
      if (response.data.post_http_req !== "") {
        const responsePost = await api.get(
          `${process.env.REACT_APP_API_URL}/action/http/${action.id}/req?method=POST`
        );
        setSelectedReqBodyPost(responsePost.data);
      }

      if (response.data.put_http_req !== "") {
        const responsePut = await api.get(
          `${process.env.REACT_APP_API_URL}/action/http/${action.id}/req?method=PUT`
        );
        setSelectedReqBodyPut(responsePut.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const response = await api.get(
        `${process.env.REACT_APP_API_URL}/action/http?name=${searchTerm}`
      );
      setActionData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${process.env.REACT_APP_API_URL}/action/http`
        );
        console.log(response);
        setActionData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [api]);

  const handleDelete = async () => {
    try {
      await api.delete(
        `${process.env.REACT_APP_API_URL}/action/http/${deleteActionId}`
      );
      // Success message or redirect to table page
      console.log("success delete Action");
      setActionData((prevData) =>
        prevData.filter((action, index) => index !== deleteIndex)
      );
      const userIdToDelete = actionData[deleteIndex].id;
      if (userIdToDelete === selectedActionData.id) {
        setSelectedActionData(null);
      }
    } catch (error) {
      console.log(error);
      // Error message
    } finally {
      setDeleteActionId(null);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Action</title>
      </Helmet>
      <Navbar />
      <SidebarNav />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="grid grid-cols-2 gap-2">
            <div className="border-2 border-gray-200 border-dashed dark:border-gray-700">
              <h2 className="text-2xl font-bold py-6 ml-3">Action</h2>
              <div className="mb-3">
                <SearchComponent
                  onSubmit={handleSubmit}
                  onChange={handleSearchTermChange}
                />
              </div>
            </div>
            <div className="border-2 border-gray-200 border-dashed dark:border-gray-700">
              <div className="mt-2 mr-3 flex justify-end">
                <a href="/action/add">
                  <Button>Add</Button>
                </a>
              </div>
              {selectedActionData ? (
                <div>
                  <h2 className="text-2xl font-bold py-6 ml-3">
                    {selectedActionData.name}
                  </h2>
                </div>
              ) : (
                <h2 className="text-2xl font-bold py-6 ml-3">
                  Select an Action to display
                </h2>
              )}
            </div>
            <div className="border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
              <Table>
                <Table.Body className="divide-y">
                  {actionData.map((action, index) => (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={action?.id}
                    >
                      <Table.Cell
                        className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
                        onClick={() => onClickActionName(index)}
                      >
                        {action?.name}
                      </Table.Cell>
                      <Table.Cell>
                        <a
                          href={`/action/edit/${action?.id}`}
                          className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                        >
                          Edit
                        </a>
                      </Table.Cell>
                      <Table.Cell>
                        <button
                          onClick={() => onClickDelete(index)}
                          className="font-medium text-red-600 hover:underline dark:text-blue-500"
                        >
                          Delete
                        </button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
            <div className="border-2 border-gray-200 border-dashed dark:border-gray-700">
              {selectedActionData ? (
                <div className="flex flex-col items-center">
                  <div className="max-w-[400px] w-full mx-auto bg-white p-4">
                    <div className="flex flex-col py-2">
                      <label htmlFor="">Name</label>
                      <input
                        className="border p-2"
                        id="name"
                        type="text"
                        value={selectedActionData.name}
                        disabled={true}
                        placeholder="Enter Action Name"
                      />
                    </div>
                    <div className="flex flex-col py-2">
                      <label htmlFor="">Get Http Request</label>
                      <input
                        className="border p-2"
                        id="get_http_request"
                        type="text"
                        value={selectedActionData.get_http_req}
                        disabled={true}
                        placeholder="Enter Action Name"
                      />
                    </div>
                    <div className="flex flex-col py-2">
                      <label htmlFor="">Post Http Request</label>
                      <input
                        className="border p-2"
                        id="name"
                        type="text"
                        value={selectedActionData.post_http_req}
                        disabled={true}
                        placeholder="Enter Action Name"
                      />
                      {selectedActionData.post_http_req !== "" &&
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
                        value={selectedActionData.put_http_req}
                        disabled={true}
                        placeholder="Enter Action Name"
                      />
                      {selectedActionData.put_http_req !== "" &&
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
                        value={selectedActionData.del_http_req}
                        disabled={true}
                        placeholder="Enter Action Name"
                      />
                    </div>
                    <div className="flex flex-col py-2">
                      <label htmlFor="">Api Key</label>
                      <input
                        className="border p-2"
                        id="name"
                        type="text"
                        value={selectedActionData.api_key}
                        disabled={true}
                        placeholder="Enter Action Name"
                      />
                    </div>
                    <div className="flex flex-col py-2">
                      <label htmlFor="">Text Response</label>
                      <input
                        className="border p-2"
                        id="name"
                        type="text"
                        value={selectedActionData.text_response}
                        disabled={true}
                        placeholder="Enter Action Name"
                      />
                    </div>
                    <div className="mt-2 mr-3 flex justify-end">
                      <a href={`/action/${selectedActionData.id}/detail`}>
                        <Button>Detail</Button>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <h2 className="text-2xl font-normal py-6 ml-3">
                  Will Display Detail Action Here
                </h2>
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
                    Are you sure you want to delete this action?
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
  );
}
