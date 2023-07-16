import React from "react";
import loginImg from "../asset/login1.svg";
import loginImg2 from "../asset/login2.svg";

export default function LoginRegisterGrid() {
  return (
    <div className="bg-gray-100 hidden sm:block col-span-2">
      <div className="hidden sm:block col-span-2 flex items-start justify-start relative">
        <img
          src={loginImg}
          alt=""
          className="h-24 w-24 absolute top-0 left-0 ml-4 mt-2"
        />
      </div>
      <div className="h-full flex items-center justify-center relative">
        <div className="text-center">
          <div className="py-2 mb-4">
            <h3 className="text-3xl bottom-1 font-bold">ChatVeteran</h3>
          </div>
          <img src={loginImg2} alt="" />
          <div className="py-2 mt-4">
            <h5 className="text-4l font-bold">
              Sistem Chatbot Bantuan Layanan Informasi Akademik
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}
