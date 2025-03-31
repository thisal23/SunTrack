import React from "react";
import user from "../../assets/user.png";

// Sachini part
const DriverInfoCard = () => {
  return (
    <div>
      <div className="flex flex-row justify-center">
        <span className="text-2xl text-[#0F2043]">Driver Details</span>
      </div>

      <div>
        <div className="rounded-full flex flex-row justify-center">
          <img src={user} alt="user_img" className="w-50 h-50" />
        </div>
      </div>
      <div className="mx-auto flex flex-row justify-center w-full">
        <table className="table-auto border-collapse w-full">
          <tbody>
            <tr className="">
              <td className=" px-4 py-2 font-bold">Full Name</td>
              <td className=" text-right px-4 py-2">A.K. Dissanayake</td>
            </tr>

            <tr className="">
              <td className=" px-4 py-2 font-bold">Driver ID</td>
              <td className=" text-right px-4 py-2">D10246</td>
            </tr>

            <tr className="">
              <td className=" px-4 py-2 font-bold">NIC No</td>
              <td className=" text-right px-4 py-2">197548632149</td>
            </tr>

            <tr className="">
              <td className=" px-4 py-2 font-bold">License Id</td>
              <td className=" text-right px-4 py-2">B1234567</td>
            </tr>

            <tr className="">
              <td className=" px-4 py-2 font-bold">License category</td>
              <td className=" text-right px-4 py-2">Light</td>
            </tr>

            <tr className="">
              <td className=" px-4 py-2 font-bold">Contact No</td>
              <td className=" text-right px-4 py-2">071 456 7894</td>
            </tr>

            <tr className="">
              <td className=" px-4 py-2 font-bold">Joined date</td>
              <td className=" text-right px-4 py-2">01/05/2024</td>
            </tr>

            <tr className="">
              <td className=" px-4 py-2 font-bold">Address</td>
              <td className=" text-right px-4 py-2">
                45/V , Katubedda, Moratuwa
              </td>
            </tr>

            <tr className="">
              <td className=" px-4 py-2 font-bold">Blood group</td>
              <td className=" text-right px-4 py-2">O - (O negative)</td>
            </tr>

            <tr className="">
              <td className=" px-4 py-2 font-bold">Emergency contact No</td>
              <td className=" text-right px-4 py-2">072 789 9635</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button
        type="button"
        className="block mx-auto text-white bg-[#E8AF30] px-4 py-2 hover:bg-[#D49A17] border-1 border-[#D49A17] rounded-sm my-4"
      >
        View Trip Details
      </button>
    </div>
  );
};
export default DriverInfoCard;
