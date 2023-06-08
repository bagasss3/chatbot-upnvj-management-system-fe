import React, { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import Navbar from "../component/navbar";
import SidebarNav from "../component/sidebar";
import useAxios from "../interceptor/useAxios";

export default function FallbackChatLogPage() {
  const [fallbackChatLogData, setFallbackChatLogData] = useState([]);
  let api = useAxios();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${process.env.REACT_APP_API_URL}/intent/log/fallback`
        );
        setFallbackChatLogData(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [api]);

  const handleUpdateFallback = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `${process.env.REACT_APP_API_URL}/intent/fallback/update`
      );
      setFallbackChatLogData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const renderTables = () => {
    return fallbackChatLogData.map((clusterData) => (
      <div key={clusterData.cluster}>
        {clusterData.cluster === null ? (
          <h2 className="text-2xl font-bold py-6 ml-3">Not Grouped</h2>
        ) : (
          <h2 className="text-2xl font-bold py-6 ml-3">
            Group {clusterData.cluster}
          </h2>
        )}
        <Table striped={true}>
          <Table.Head>
            <Table.HeadCell>Chat</Table.HeadCell>
            <Table.HeadCell>Tanggal</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {clusterData.data.map((fallback, index) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                key={fallback.id}
              >
                <Table.Cell>{fallback.chat}</Table.Cell>
                <Table.Cell>
                  {new Date(fallback.created_at).toLocaleDateString()}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    ));
  };

  return (
    <div>
      <Navbar />
      <SidebarNav />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="mb-2 flex justify-between items-center">
            <h2 className="text-2xl font-bold py-6 ml-3">Fallback Chat Log</h2>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleUpdateFallback}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Fallback"}
            </button>
          </div>
          {renderTables()}
        </div>
      </div>
    </div>
  );
}
