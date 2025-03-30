import React from "react";
import NavBar from "../../components/NavBar/NavBar";

const ServiceMaintenance = () => {
  return (
    <>
      <>
        <NavBar />
        <div className="container mx-auto w-full">
          <div className="flex flex-row justify-start my-5">
            <span className="text-3xl text-[#0F2043] font-semibold">
              Maintenance &gt; Service Maintenance
            </span>
          </div>

          <div className="border-b-1 border-[#000] w-full mb-5"></div>
        </div>
      </>
    </>
  );
};

export default ServiceMaintenance;
