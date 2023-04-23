import React, { useState, useEffect } from "react";
import Navbar from "../component/navbar";
import SidebarNav from "../component/sidebar";
import useAxios from "../interceptor/useAxios";

export default function DashboardPage() {
  const [intentData, setIntentData] = useState(0);
  const [actionData, setActionData] = useState(0);
  const [utteranceData, setUtteranceData] = useState(0);

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

        const utteranceResponse = await api.get(
          `${process.env.REACT_APP_API_URL}/utterance/count`
        );
        setUtteranceData(utteranceResponse.data);
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
              href="/"
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
              href="/"
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
              href="/"
              className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Utterance
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {utteranceData}
              </p>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <a
              href="/"
              className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Top Intent
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                Here are the biggest enterprise technology acquisitions of 2021
                so far, in reverse chronological order.
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
