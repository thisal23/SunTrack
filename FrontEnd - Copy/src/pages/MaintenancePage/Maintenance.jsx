import React from "react";

const Maintenance = () => {
  return (
    <>
      <div>
        <label className="font-medium text-gray-700">
          Vehicle No: <span className="text-red-500"></span>
        </label>
        <input
          type="text"
          name="vehicle_title"
          // value={formData.vehicle_title}
          // onChange={handleInputChange}
          placeholder="ABC-4567"
          className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
        />
      </div>

      <div className="flex flex-col">
        <label className="font-medium text-gray-700">Document Type:</label>
        <select
          name="document_type"
          // value={formData.fuel_type}
          // onChange={handleInputChange}
          className="block w-full py-2.5 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
        >
          <option value="license">License</option>
          <option value="insuarance">Insuarance</option>
          <option value="emission">Emission</option>
        </select>
      </div>

      <div>
        <label className="font-medium text-gray-700">
          License Last Update:
        </label>
        <input
          type="date"
          name="lisence_last_date"
          // value={formData.lisence_last_date}
          // onChange={handleInputChange}
          className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
          placeholder="2020/05/12"
        />
      </div>

      <div>
        <label className="font-medium text-gray-700">
          Document Expiry Date:
        </label>
        <input
          type="date"
          name="document_expire_date"
          // value={formData.lisence_expire_date}
          // onChange={handleInputChange}
          className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
          placeholder="2026/**/**"
        />
      </div>

      <div className="flex flex-col">
        <label className="font-medium text-gray-700">
          Upload Document <small>(.pdf, .jpg, .jpeg)</small>
        </label>
        <input
          type="file"
          name="ldocument"
          // onChange={handleInputChange}
          className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
        />
      </div>

      <div className="flex flex-row align-items-right">
        <button
          type="cancel"
          // onClick={handleSubmit}
          className="w-auto flex flex-row mr-0 ml-auto mt-5 py-2 px-4 bg-white text-blue-600 font-semibold rounded-md shadow hover:bg-#d6deecfa transition duration-200"
        >
          Cancel
        </button>

        <button
          type="submit"
          // onClick={handleSubmit}
          className="w-auto flex flex-row mr-0 ml-auto mt-5 py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition duration-200"
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default Maintenance;
