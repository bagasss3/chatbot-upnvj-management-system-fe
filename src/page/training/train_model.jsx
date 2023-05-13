import React, { useState, useEffect } from "react";
import { Table, Modal, Button } from "flowbite-react";
import Navbar from "../../component/navbar";
import TrainingLogo from "../../asset/login_training.svg";
import SidebarNav from "../../component/sidebar";
import useAxios from "../../interceptor/useAxios";

export default function TrainingModelPage() {
  const [trainingHistoryData, setTrainingHistoryData] = useState([]);
  const [startTrain, setStartTrain] = useState(false);
  let api = useAxios();

  const onClickTrainData = () => {
    setStartTrain(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${process.env.REACT_APP_API_URL}/training-history`
        );
        setTrainingHistoryData(response.data);
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
          <div className="grid grid-cols-2 gap-4 mb-4">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Training Model
            </h5>
          </div>
          <div className="grid grid-cols-6 gap-4">
            <div className="col-start-2 col-span-4 ...">
              <div className="flex flex-col items-center">
                <button onClick={onClickTrainData}>
                  <img
                    src={TrainingLogo}
                    alt=""
                    className="h-24 w-24 top-0 left-0 ml-4 mt-2"
                  />
                </button>
              </div>
            </div>
            <div className="col-start-1 col-end-7 ...">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Riwayat Train Model
              </h5>
              <Table striped={true}>
                <Table.Head>
                  <Table.HeadCell>No</Table.HeadCell>
                  <Table.HeadCell>User</Table.HeadCell>
                  <Table.HeadCell>Total Time</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                  <Table.HeadCell>Tanggal dibuat</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {trainingHistoryData.map((data, index) => (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={data?.id}
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {index + 1}
                      </Table.Cell>
                      <Table.Cell>{data?.user_id}</Table.Cell>
                      <Table.Cell>{data?.total_time}</Table.Cell>
                      <Table.Cell>{data?.status}</Table.Cell>
                      <Table.Cell>
                        {new Date(data?.created_at).toLocaleDateString()}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
              <Modal
                show={startTrain === true}
                size="md"
                popup={true}
                onClose={() => setStartTrain(false)}
              >
                <Modal.Header />
                <Modal.Body>
                  <div className="text-center">
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                      Anda akan memulai Training Model. Proses ini bisa
                      berlangsung lama tergantung data training. Ingin
                      melanjutkan Proses?
                    </h3>
                    <div className="flex justify-center gap-4">
                      <Button color="success">Yes, I'm sure</Button>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
