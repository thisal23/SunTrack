import React, { useState } from "react";
import { FaUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import DriverInfoCard from "./DriverInfoCard";

// Sachini part
const DriverUpdateCard = ({ driverName, destination, time }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between bg-[#F0F3F8] mx-2 sm:mx-5 rounded-xl px-4 py-4 items-center sm:items-start">
        {/* User Info Section */}
        <div className="flex flex-row items-center gap-3 w-full sm:w-auto">
          <div className="user_image rounded-full border-2 bg-[#0F2043] p-2">
            <FaUser className="text-white text-3xl sm:text-4xl" />
          </div>
          <div className="flex flex-col">
            <button
              type="button"
              onClick={showModal}
              className="p-0 m-0 text-left"
            >
              <Link
                to={"#"}
                className="text-lg sm:text-xl text-[#0F2043] font-normal hover:underline"
              >
                {driverName}
              </Link>
            </button>
            <span className="text-sm text-[#0F2043]">{destination}</span>
          </div>
        </div>

        {/* Time Section */}
        <div className="text-center mt-3 sm:mt-0 sm:text-right">
          <span className="text-[#0F2043] text-sm sm:text-base font-medium">
            {time}
          </span>
        </div>
      </div>

      <Modal
        title="Driver Info"
        open={isModalOpen}
        onCancel={handleCancel}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
      >
        <DriverInfoCard />
      </Modal>
    </>
  );
};

export default DriverUpdateCard;
