import React, { useState, useEffect } from "react";
import { Button, Table, Modal } from "flowbite-react";
import Navbar from "../../component/navbar";
import SidebarNav from "../../component/sidebar";
import useAxios from "../../interceptor/useAxios";
import SearchComponent from "../../component/searchbar";

export default function UtterancePage() {
  const [utteranceData, setUtteranceData] = useState([]);
  const [deleteUtteranceId, setDeleteUtteranceId] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [selectedUtteranceData, setSelectedUtteranceData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  let api = useAxios();

  function handleSearchTermChange(e) {
    setSearchTerm(e.target.value);
  }

  const onClickDelete = (index) => {
    setDeleteIndex(index);
    const userIdToDelete = utteranceData[index].id;
    setDeleteUtteranceId(userIdToDelete);
  };

  const onClickUtteranceName = async (index) => {
    const utterance = utteranceData[index];
    try {
      const response = await api.get(
        `${process.env.REACT_APP_API_URL}/utterance/${utterance.id}`
      );
      console.log(response);
      setSelectedUtteranceData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const response = await api.get(
        `${process.env.REACT_APP_API_URL}/utterance?name=${searchTerm}`
      );
      setUtteranceData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${process.env.REACT_APP_API_URL}/utterance`
        );
        console.log(response);
        setUtteranceData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [api]);

  const handleDelete = async () => {
    try {
      await api.delete(
        `${process.env.REACT_APP_API_URL}/utterance/${deleteUtteranceId}`
      );
      // Success message or redirect to table page
      console.log("success delete utterance");
      setUtteranceData((prevData) =>
        prevData.filter((utterance, index) => index !== deleteIndex)
      );
      const userIdToDelete = utteranceData[deleteIndex].id;
      if (userIdToDelete === selectedUtteranceData.id) {
        setSelectedUtteranceData(null);
      }
    } catch (error) {
      console.log(error);
      // Error message
    } finally {
      setDeleteUtteranceId(null);
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
              <h2 className="text-2xl font-bold py-6 ml-3">Utterance</h2>
              <div className="mb-3">
                <SearchComponent
                  onSubmit={handleSubmit}
                  onChange={handleSearchTermChange}
                />
              </div>
            </div>
            <div className="border-2 border-gray-200 border-dashed dark:border-gray-700">
              <div className="mt-2 mr-3 flex justify-end">
                <a href="/utterance/add">
                  <Button>Add</Button>
                </a>
              </div>
              {selectedUtteranceData ? (
                <div>
                  <h2 className="text-2xl font-bold py-6 ml-3">
                    {selectedUtteranceData.name}
                  </h2>
                </div>
              ) : (
                <h2 className="text-2xl font-bold py-6 ml-3">
                  Select an utterance to display
                </h2>
              )}
            </div>
            <div className="border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
              <Table>
                <Table.Body className="divide-y">
                  {utteranceData.map((utterance, index) => (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={utterance?.id}
                    >
                      <Table.Cell
                        className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
                        onClick={() => onClickUtteranceName(index)}
                      >
                        {utterance?.name}
                      </Table.Cell>
                      <Table.Cell>
                        <a
                          href={`/utterance/edit/${utterance?.id}`}
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
              {selectedUtteranceData ? (
                <div>
                  <h2 className="text-2xl font-bold py-6 ml-3">Response</h2>
                  <p className="ml-3">{selectedUtteranceData.response}</p>
                  {/* Add any other fields that you want to display here */}
                </div>
              ) : (
                <h2 className="text-2xl font-normal py-6 ml-3">
                  Will Display Response Here
                </h2>
              )}
            </div>
            <Modal
              show={deleteUtteranceId !== null}
              size="md"
              popup={true}
              onClose={() => setDeleteUtteranceId(null)}
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
  );
}
