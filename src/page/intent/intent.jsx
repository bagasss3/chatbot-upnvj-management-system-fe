import React, { useState, useEffect } from "react";
import { Button, Table, Modal } from "flowbite-react";
import Navbar from "../../component/navbar";
import SidebarNav from "../../component/sidebar";
import useAxios from "../../interceptor/useAxios";
import SearchComponent from "../../component/searchbar";

export default function IntentPage() {
  const [example, setExample] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [intentData, setIntentData] = useState([]);
  const [exampleData, setExampleData] = useState([]);
  const [deleteIntentId, setDeleteIntentId] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteExampleIntentId, setDeleteExampleIntentId] = useState(null);
  const [deleteExampleIndex, setDeleteExampleIndex] = useState(null);
  const [newExample, setNewExample] = useState("");
  const [updateExampleIndex, setUpdateExampleIndex] = useState(null);
  const [updateExampleIntentId, setUpdateExampleIntentId] = useState(null);
  const [selectedIntentData, setSelectedIntentData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  let api = useAxios();

  function handleSearchTermChange(e) {
    setSearchTerm(e.target.value);
  }

  function handleExampleChange(e) {
    setExample(e.target.value);
  }

  function handleNewExampleChange(e) {
    setNewExample(e.target.value);
  }

  const onClickDelete = (index) => {
    setDeleteIndex(index);
    const userIdToDelete = intentData[index].id;
    setDeleteIntentId(userIdToDelete);
  };

  const onClickExampleDelete = (index) => {
    setDeleteExampleIndex(index);
    const exampleIdToDelete = exampleData[index].id;
    setDeleteExampleIntentId(exampleIdToDelete);
  };

  const onClickExampleUpdate = (index) => {
    setUpdateExampleIndex(index);
    const exampleIdToUpdate = exampleData[index].id;
    setUpdateExampleIntentId(exampleIdToUpdate);
    setNewExample(exampleData[index].example);
  };

  const onClickIntentName = async (index) => {
    const intent = intentData[index];
    try {
      const response = await api.get(
        `${process.env.REACT_APP_API_URL}/intent/${intent.id}`
      );
      console.log(response);
      setSelectedIntentData(response.data);

      const responseExample = await api.get(
        `${process.env.REACT_APP_API_URL}/example/${intent.id}`
      );
      console.log(responseExample);
      setExampleData(responseExample.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const response = await api.get(
        `${process.env.REACT_APP_API_URL}/intent?name=${searchTerm}`
      );
      setIntentData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  async function handleSubmitExample(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let payload = {
        intent_id: selectedIntentData.id,
        example,
      };

      const response = await api.post(
        `${process.env.REACT_APP_API_URL}/example`,
        payload
      );
      setExample("");
      const newExample = [...exampleData, response.data];
      setExampleData(newExample);
      console.log("Success Add Example");
    } catch (error) {
      if (error.response.data.message === "unauthorized") {
        setError("no permission to add intent example");
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${process.env.REACT_APP_API_URL}/intent`
        );
        console.log(response);
        setIntentData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [api]);

  const handleDelete = async () => {
    try {
      await api.delete(
        `${process.env.REACT_APP_API_URL}/intent/${deleteIntentId}`
      );
      // Success message or redirect to table page
      console.log("success delete Intent");
      setIntentData((prevData) =>
        prevData.filter((intent, index) => index !== deleteIndex)
      );
      const userIdToDelete = intentData[deleteIndex].id;
      if (userIdToDelete === selectedIntentData.id) {
        setSelectedIntentData(null);
      }
    } catch (error) {
      console.log(error);
      // Error message
    } finally {
      setDeleteIntentId(null);
    }
  };

  const handleDeleteExample = async () => {
    try {
      await api.delete(
        `${process.env.REACT_APP_API_URL}/example/${selectedIntentData.id}/${deleteExampleIntentId}`
      );
      // Success message or redirect to table page
      console.log("success delete Intent Example");
      setExampleData((prevData) =>
        prevData.filter((example, index) => index !== deleteExampleIndex)
      );
    } catch (error) {
      console.log(error);
      // Error message
    } finally {
      setDeleteExampleIntentId(null);
    }
  };

  async function handleUpdateExample(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let payload = {
        example: newExample,
      };

      const response = await api.put(
        `${process.env.REACT_APP_API_URL}/example/${selectedIntentData.id}/${updateExampleIntentId}`,
        payload
      );
      console.log(response.data);
      const newExampleData = [...exampleData];
      console.log(newExampleData);
      newExampleData[updateExampleIndex].example = response.data.example;
      setExampleData(newExampleData);
      console.log(exampleData);
      setNewExample("");
      setUpdateExampleIndex(null);
      setUpdateExampleIntentId(null);
      console.log("Success Update Example");
    } catch (error) {
      if (error.response.data.message === "unauthorized") {
        setError("no permission to add intent example");
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

  const handleCancelUpdateExample = () => {
    setNewExample("");
  };

  const addBgColor = (text) => {
    let modifiedText = text.replace(
      /\[(.*?)\]/g,
      '<span style="background-color: #26B7FF;">$1</span>'
    );
    modifiedText = modifiedText.replace(
      /\((.*?)\)/g,
      '<span style="background-color: grey;">$1</span>'
    );
    return modifiedText;
  };

  const [showEntityInput, setShowEntityInput] = useState(false);
  const [entityList, setEntityList] = useState([]);
  const [entity, setEntity] = useState("");
  const [deleteEntityIndex, setDeleteEntityIndex] = useState(null);
  const [deleteEntityId, setDeleteEntityId] = useState(null);

  function handleEntityChange(e) {
    setEntity(e.target.value);
  }

  const handleEntityClick = (name) => {
    setExample(`[value](${name})`);
  };

  const handleEntityClickButton = () => {
    setShowEntityInput(true);
  };

  const handleEntityCancelButton = () => {
    setShowEntityInput(false);
    setEntity("");
  };

  useEffect(() => {
    async function fetchEntityList() {
      const response = await api.get(
        `${process.env.REACT_APP_API_URL}/intent/${selectedIntentData?.id}/entity`
      );
      setEntityList(response.data);
    }
    fetchEntityList();
  }, [api, selectedIntentData]);

  async function handleEntitySaveButton(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let payload = {
        name: entity,
        intent_id: selectedIntentData.id,
      };

      const response = await api.post(
        `${process.env.REACT_APP_API_URL}/intent/entity`,
        payload
      );
      setEntity("");
      console.log(response.data);
      const newEntityList = [...entityList, response.data];
      setEntityList(newEntityList);
      console.log("Success Add Entity");
    } catch (error) {
      if (error.response.data.message === "unauthorized") {
        setError("no permission to add entity");
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

  const onClickEntityDelete = (index) => {
    setDeleteEntityIndex(index);
    const entityIdToDelete = entityList[index].id;
    setDeleteEntityId(entityIdToDelete);
  };

  const handleDeleteEntity = async () => {
    try {
      await api.delete(
        `${process.env.REACT_APP_API_URL}/intent/${selectedIntentData.id}/entity/${deleteEntityId}`
      );
      // Success message or redirect to table page
      console.log("success delete Entity");
      setEntityList((prevData) =>
        prevData.filter((example, index) => index !== deleteEntityIndex)
      );
    } catch (error) {
      console.log(error);
      // Error message
    } finally {
      setDeleteEntityId(null);
    }
  };

  return (
    <div>
      <Navbar />
      <SidebarNav />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="grid grid-cols-2 gap-2">
            <div className="border-2 border-gray-200 border-dashed dark:border-gray-700">
              <h2 className="text-2xl font-bold py-6 ml-3">Intent</h2>
              <div className="mb-3">
                <SearchComponent
                  onSubmit={handleSubmit}
                  onChange={handleSearchTermChange}
                />
              </div>
            </div>
            <div className="border-2 border-gray-200 border-dashed dark:border-gray-700">
              <div className="mt-2 mr-3 flex justify-end">
                <a href="/Intent/add">
                  <Button>Add</Button>
                </a>
              </div>
              {selectedIntentData ? (
                <div>
                  <h2 className="text-2xl font-bold py-6 ml-3">
                    {selectedIntentData.name}
                  </h2>
                </div>
              ) : (
                <h2 className="text-2xl font-bold py-6 ml-3">
                  Select an Intent to display
                </h2>
              )}
            </div>
            <div className="border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
              <Table>
                <Table.Body className="divide-y">
                  {intentData.map((intent, index) => (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={intent?.id}
                    >
                      {intent?.id !== "1" ? (
                        <Table.Cell
                          className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
                          onClick={() => onClickIntentName(index)}
                        >
                          {intent?.name}
                        </Table.Cell>
                      ) : (
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {intent?.name}
                        </Table.Cell>
                      )}

                      {intent?.id !== "1" && (
                        <Table.Cell>
                          <a
                            href={`/intent/edit/${intent?.id}`}
                            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                          >
                            Edit
                          </a>
                        </Table.Cell>
                      )}

                      {intent?.id !== "1" && (
                        <Table.Cell>
                          <button
                            onClick={() => onClickDelete(index)}
                            className="font-medium text-red-600 hover:underline dark:text-blue-500"
                          >
                            Delete
                          </button>
                        </Table.Cell>
                      )}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
            <div className="border-2 border-gray-200 border-dashed dark:border-gray-700">
              {selectedIntentData ? (
                <div>
                  <h3 className="text-2xl font-bold py-6 ml-3">
                    Sampel Kalimat
                  </h3>
                  {newExample === "" ? (
                    <form
                      className="max-w-[400px] w-full bg-white ml-3"
                      onSubmit={handleSubmitExample}
                    >
                      <div className="flex flex-col py-2">
                        <input
                          className="border p-2"
                          id="example"
                          type="text"
                          value={example}
                          onChange={handleExampleChange}
                          placeholder="Enter Example"
                        />
                      </div>
                      {error && (
                        <div className="text-red-500 py-2">{error}</div>
                      )}
                      {showEntityInput && (
                        <div>
                          <div className="flex flex-col py-2">
                            <input
                              className="border p-2"
                              id="entity"
                              type="text"
                              value={entity}
                              onChange={handleEntityChange}
                              placeholder="Enter Entity"
                            />
                          </div>
                          <h3 className="text-lg font-bold">Entity List:</h3>
                          {entityList.length > 0 ? (
                            <Table>
                              <Table.Body className="divide-y">
                                {entityList.map((entity, index) => (
                                  <Table.Row
                                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                    key={entity?.id}
                                  >
                                    <Table.Cell
                                      className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
                                      onClick={() =>
                                        handleEntityClick(entity?.name)
                                      }
                                    >
                                      {entity?.name}
                                    </Table.Cell>
                                    <Table.Cell>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          onClickEntityDelete(index)
                                        }
                                        className="font-medium text-red-600 hover:underline dark:text-blue-500"
                                      >
                                        Delete
                                      </button>
                                    </Table.Cell>
                                  </Table.Row>
                                ))}
                              </Table.Body>
                            </Table>
                          ) : (
                            <div>
                              <h2>Empty Entity</h2>
                            </div>
                          )}
                        </div>
                      )}
                      {entity === "" ? (
                        <button
                          className="border w-full my-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                          disabled={isLoading}
                          type="button"
                          onClick={handleEntityClickButton}
                        >
                          {isLoading ? "Tambah Entity..." : "Tambah Entity"}
                        </button>
                      ) : (
                        <div>
                          <button
                            className="border w-full my-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                            disabled={isLoading}
                            type="button"
                            onClick={handleEntitySaveButton}
                          >
                            {isLoading ? "Menyimpan Entity ..." : "Lanjut"}
                          </button>
                        </div>
                      )}
                      {showEntityInput && (
                        <button
                          className="border w-full my-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                          disabled={isLoading}
                          type="button"
                          onClick={handleEntityCancelButton}
                        >
                          {isLoading ? "Batal ..." : "Batal"}
                        </button>
                      )}
                      <button
                        className="border w-full my-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? "Tambah Example..." : "Tambah Example"}
                      </button>
                    </form>
                  ) : (
                    <div>
                      <form
                        className="max-w-[400px] w-full bg-white ml-3"
                        onSubmit={handleUpdateExample}
                      >
                        <div className="flex flex-col py-2">
                          <input
                            className="border p-2"
                            id="example"
                            type="text"
                            value={newExample}
                            onChange={handleNewExampleChange}
                            placeholder="Update Example"
                          />
                        </div>
                        {error && (
                          <div className="text-red-500 py-2">{error}</div>
                        )}
                        <button
                          className="border w-full my-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? "Update Example..." : "Update Example"}
                        </button>
                      </form>
                      <button
                        className="max-w-[400px] w-full ml-3 border w-full my-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                        onClick={handleCancelUpdateExample}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  <Table>
                    <Table.Body className="divide-y">
                      {exampleData.map((example, index) => (
                        <Table.Row
                          className="bg-white dark:border-gray-700 dark:bg-gray-800"
                          key={example?.id}
                        >
                          <Table.Cell>
                            <div
                              className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
                              onClick={() => onClickIntentName(index)}
                            >
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: addBgColor(example?.example),
                                }}
                              />
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <button
                              onClick={() => onClickExampleUpdate(index)}
                              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                            >
                              Edit
                            </button>
                          </Table.Cell>
                          <Table.Cell>
                            <button
                              onClick={() => onClickExampleDelete(index)}
                              className="font-medium text-red-600 hover:underline dark:text-blue-500"
                            >
                              Delete
                            </button>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                  {/* Add any other fields that you want to display here */}
                </div>
              ) : (
                <h2 className="text-2xl font-normal py-6 ml-3">
                  Will Display Intent Data Here
                </h2>
              )}
            </div>
            <Modal
              show={deleteIntentId !== null}
              size="md"
              popup={true}
              onClose={() => setDeleteIntentId(null)}
            >
              <Modal.Header />
              <Modal.Body>
                <div className="text-center">
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this intent?
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button color="failure" onClick={handleDelete}>
                      Yes, I'm sure
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
            <Modal
              show={deleteExampleIntentId !== null}
              size="md"
              popup={true}
              onClose={() => setDeleteExampleIntentId(null)}
            >
              <Modal.Header />
              <Modal.Body>
                <div className="text-center">
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this product?
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button color="failure" onClick={handleDeleteExample}>
                      Yes, I'm sure
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
            <Modal
              show={deleteEntityId !== null}
              size="md"
              popup={true}
              onClose={() => setDeleteEntityId(null)}
            >
              <Modal.Header />
              <Modal.Body>
                <div className="text-center">
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this product?
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button color="failure" onClick={handleDeleteEntity}>
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
