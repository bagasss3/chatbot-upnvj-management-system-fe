import React, { useState, useEffect } from "react";
import { Button, Table, Modal } from "flowbite-react";
import Navbar from "../../component/navbar";
import SidebarNav from "../../component/sidebar";
import useAxios from "../../interceptor/useAxios";

export default function KrsActionPage() {
  const [krsActionData, setKrsActionData] = useState([]);
  const [deleteKrsActionId, setDeleteKrsActionId] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  let api = useAxios();

  const onClickDelete = (index) => {
    setDeleteIndex(index);
    const idToDelete = krsActionData[index].id;
    setDeleteKrsActionId(idToDelete);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${process.env.REACT_APP_API_URL}/action/krs`
        );
        console.log(response);
        setKrsActionData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [api]);

  const handleDelete = async () => {
    try {
      await api.delete(
        `${process.env.REACT_APP_API_URL}/action/krs/${deleteKrsActionId}`
      );
      // Success message or redirect to table page
      console.log("success delete krs action");
      setKrsActionData((prevData) =>
        prevData.filter((krs, index) => index !== deleteIndex)
      );
    } catch (error) {
      console.log(error);
      // Error message
    } finally {
      setDeleteKrsActionId(null);
    }
  };

  return (
    <div>
      <Navbar />
      <SidebarNav />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="mb-5">
            <a href={`/action/krs/add`}>
              <Button>Add</Button>
            </a>
          </div>
          <Table striped={true}>
            <Table.Head>
              <Table.HeadCell>No</Table.HeadCell>
              <Table.HeadCell>Nama</Table.HeadCell>
              <Table.HeadCell>Get Http Req</Table.HeadCell>
              <Table.HeadCell>API Key</Table.HeadCell>
              <Table.HeadCell>Tanggal dibuat</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {krsActionData.map((krsAction, index) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={krsAction?.id}
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {index + 1}
                  </Table.Cell>
                  <Table.Cell>{krsAction?.name}</Table.Cell>
                  <Table.Cell>{krsAction?.get_http_req}</Table.Cell>
                  <Table.Cell>{krsAction?.api_key}</Table.Cell>
                  <Table.Cell>
                    {new Date(krsAction?.created_at).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <a
                      href={`/action/krs/edit/${krsAction?.id}`}
                      className="font-medium text-green-600 hover:underline dark:text-blue-500"
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
          <Modal
            show={deleteKrsActionId !== null}
            size="md"
            popup={true}
            onClose={() => setDeleteKrsActionId(null)}
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this krs action?
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
  );
}
