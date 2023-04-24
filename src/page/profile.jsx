import React, { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import Navbar from "../component/navbar";
import ProfileLogo from "../asset/profilelogo.svg";
import SidebarNav from "../component/sidebar";
import useAxios from "../interceptor/useAxios";

export default function LoginPage() {
  const [userProfileData, setUserProfileData] = useState(null);
  let api = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${process.env.REACT_APP_API_URL}/user/profile`
        );
        setUserProfileData(response.data);
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
              Profile
            </h5>
          </div>
          <div className="grid grid-cols-6 gap-4">
            <div className="col-start-2 col-span-4 ...">
              <div className="flex flex-col items-center">
                <img
                  src={ProfileLogo}
                  alt=""
                  className="h-24 w-24 top-0 left-0 ml-4 mt-2"
                />
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {userProfileData?.name}
                </h5>
              </div>
            </div>
            <div className="col-start-1 col-end-7 ...">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Detail Akun
              </h5>
              <h5 className="mb-2 text-2xl font-normal tracking-tight text-gray-900 dark:text-white">
                Nama : {userProfileData?.name}
              </h5>
              <h5 className="mb-2 text-2xl font-normal tracking-tight text-gray-900 dark:text-white">
                Email : {userProfileData?.email}
              </h5>
              <h5 className="mb-2 text-2xl font-normal tracking-tight text-gray-900 dark:text-white">
                Role : {userProfileData?.type}
              </h5>
              <h5 className="mb-2 text-2xl font-normal tracking-tight text-gray-900 dark:text-white">
                Tanggal Akun Dibuat :{" "}
                {new Date(userProfileData?.created_at).toLocaleDateString()}
              </h5>
              <a href="/profile/change-password">
                <Button className="mt-5" color="success" pill={true}>
                  Ubah Password
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
