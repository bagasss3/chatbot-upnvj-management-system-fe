import React, { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import Navbar from "../component/navbar";
import SidebarNav from "../component/sidebar";
import useAxios from "../interceptor/useAxios";

export default function DashboardPage() {
  const [intentData, setIntentData] = useState(0);
  const [actionData, setActionData] = useState(0);
  const [conversationData, setConversationData] = useState(0);
  const [topIntentData, setTopIntentData] = useState([]);
  const [fallbackChatLogData, setFallbackChatLogData] = useState([]);

  let api = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const intentResponse = await api.get(
          `${process.env.REACT_APP_API_URL}/intent/count`
        );
        setIntentData(intentResponse.data);

        const actionResponse = await api.get(
          `${process.env.REACT_APP_API_URL}/action/http/count`
        );
        setActionData(actionResponse.data);

        const conversationResponse = await api.get(
          `${process.env.REACT_APP_API_URL}/conversation/count`
        );
        setConversationData(conversationResponse.data);

        const topIntentResponse = await api.get(
          `${process.env.REACT_APP_API_URL}/dashboard/log/intent`
        );
        setTopIntentData(topIntentResponse.data);

        const fallbackChatLogResponse = await api.get(
          `${process.env.REACT_APP_API_URL}/intent/fallback?page=DASHBOARD`
        );
        setFallbackChatLogData(fallbackChatLogResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [api]);
  return (
    <div>
      <Navbar />
      <SidebarNav />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <a
              href="/intent"
              className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Intent
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {intentData}
              </p>
            </a>
            <a
              href="/action"
              className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Action
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {actionData}
              </p>
            </a>
            <a
              href="/conversation"
              className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Conversation
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {conversationData}
              </p>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <a
              href="/"
              className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Top 5 Intent
              </h5>
              <Table>
                <Table.Body className="divide-y">
                  {topIntentData.map((intent, index) => (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={intent?.id}
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {intent?.intent.name}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {intent?.mention}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </a>
            <a
              href="/log"
              className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Fallback Chat Log
              </h5>
              <Table>
                <Table.Body className="divide-y">
                  {fallbackChatLogData.map((fallback, index) => (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={fallback?.id}
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {fallback?.chat}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
