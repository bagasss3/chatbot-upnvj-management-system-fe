import React, { useState, useEffect } from "react";
import { Button, Table, Modal } from "flowbite-react";
import Navbar from "../../../component/navbar";
import SidebarNav from "../../../component/sidebar";
import useAxios from "../../../interceptor/useAxios";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function DetailActionPage() {
  const { id } = useParams();
  const [detailActionData, setDetailActionData] = useState([]);
  const [reqBodiesData, setReqBodiesData] = useState([]);
  const [getHttpReq, setGetHttpReq] = useState("");
  const [postHttpReq, setPostHttpReq] = useState("");
  const [putHttpReq, setPutHttpReq] = useState("");
  const [delHttpReq, setDelHttpReq] = useState("");
  const [actionName, setActionName] = useState("");
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  let api = useAxios();

  const onClickDelete = (index) => {
    setDeleteIndex(index);
    const idToDelete = detailActionData[index].id;
    setDeleteId(idToDelete);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${process.env.REACT_APP_API_URL}/action/http/${id}`
        );
        setActionName(response.data.name);
        setGetHttpReq(response.data.get_http_req);
        setPostHttpReq(response.data.post_http_req);
        setPutHttpReq(response.data.put_http_req);
        setDelHttpReq(response.data.del_http_req);

        const responseReqBodies = await api.get(
          `${process.env.REACT_APP_API_URL}/action/http/${id}/req?method=GET`
        );
        setReqBodiesData(responseReqBodies.data);
        console.log(responseReqBodies.data);

        const responseApi = await api.get(response.data.get_http_req, {
          headers: {
            API_KEY: response.data.api_key,
          },
        });

        setDetailActionData(responseApi.data);
      } catch (error) {
        if (error.message === "Request failed with status code 404") {
          setError(
            `There Might Be Something Wrong with the API: ${getHttpReq}`
          );
        } else {
          setError(error.response.data.error);
        }
      }
    };
    fetchData();
  }, [api, id, getHttpReq]);

  const handleDelete = async () => {
    try {
      await api.delete(delHttpReq + "/" + deleteId);
      // Success message or redirect to table page
      console.log("success delete data detail action");
      setDetailActionData((prevData) =>
        prevData.filter((action, index) => index !== deleteIndex)
      );
    } catch (error) {
      console.log(error);
      // Error message
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Detail Action</title>
      </Helmet>
      <Navbar />
      <SidebarNav />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold flex-shrink-0">{actionName}</h2>
            {postHttpReq !== "" && (
              <div className="flex-shrink-0">
                <a href={`/action/${id}/detail/add`}>
                  <Button>Add</Button>
                </a>
              </div>
            )}
          </div>
          <Table striped={true}>
            <Table.Head>
              <Table.HeadCell>No</Table.HeadCell>
              {reqBodiesData.map((body) => (
                <Table.HeadCell key={body.id}>{body.req_name}</Table.HeadCell>
              ))}
            </Table.Head>
            <Table.Body className="divide-y">
              {detailActionData.length > 0 ? (
                detailActionData.map((action, index) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={action?.id}
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {index + 1}
                    </Table.Cell>
                    {reqBodiesData.map((body) => (
                      <Table.HeadCell key={body.id}>
                        {action[body.req_name]}
                      </Table.HeadCell>
                    ))}
                    {putHttpReq !== "" && (
                      <Table.Cell>
                        <a
                          href={`/action/${id}/detail/edit/${action?.id}`}
                          className="font-medium text-green-600 hover:underline dark:text-blue-500"
                        >
                          Edit
                        </a>
                      </Table.Cell>
                    )}
                    {delHttpReq !== "" && (
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
                ))
              ) : (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <h2>No Data Found</h2>
                    {error && <h2>{error}</h2>}
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
          <Modal
            show={deleteId !== null}
            size="md"
            popup={true}
            onClose={() => setDeleteId(null)}
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this data?
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
