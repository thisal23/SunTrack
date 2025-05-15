import React from "react";
import vehicle from "../../assets/vehicle.jpeg";

const VehicleInfoCard = () => {
  return (
    <>
      <div>
        <div className="flex flex-row justify-center">
          <span className="text-2xl text-[#0F2043]">Vehicle Details</span>
        </div>

        <div>
          <div className="rounded-full flex flex-row justify-center">
            <img src={vehicle} alt="vehicle_img" />
          </div>
        </div>

        <div className="mx-auto flex flex-row justify-center w-full">
          <table className="table-auto border-collapse w-full">
            <tbody>
              <tr>
                <td className="px-4 font-bold">Vehicle ID</td>
                <td className="text-right px-4 py-2">......</td>
              </tr>

              <tr>
                <td className="px-4 font-bold">Fuel Type</td>
                <td className="text-right px-4 py-2">......</td>
              </tr>

              <tr>
                <td className="px-4 font-bold">Total Distance Travelled</td>
                <td className="text-right px-4 py-2">......</td>
              </tr>

              <tr>
                <td className="px-4 font-bold">Total Trips Travelled</td>
                <td className="text-right px-4 py-2">......</td>
              </tr>

              <tr>
                <td className="px-4 font-bold">Status</td>
                <td className="text-right px-4 py-2">......</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default VehicleInfoCard;
