import React, { useEffect, useState } from "react";
import apiService from "../../config/axiosConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VehicleEditCard = ({ vehicleId }) => {
  const [isFocused, setIsFocused] = useState(false);
  console.log(vehicleId);
  const [brands, setBrands] = useState([]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const [formData, setFormData] = useState({
    // assigning all the vehicle input data into vehicle form data state
    vehicle_title: "",
    type: "",
    category: "",
    chassie_number: "",
    vehicle_color: "",
    vehicle_brand: "",
    fuel_type: "",
    register_year: "",
    lisence_id: "",
    lisence_last_date: "",
    lisence_expire_date: "",
    lisence_document: null,
    insurance_id: "",
    insurance_expire_date: "",
    insurance_type: "",
    insurance_last_update: "",
    insurance_document: null,
    eco_document: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFocused(true);

    try {
      const fData = new FormData();

      fData.append("vehicleType", formData.type);
      fData.append("vehicleTypeTwo", formData.category);
      fData.append("vehicleTitle", formData.vehicle_title);
      fData.append("model", formData.register_year);
      fData.append("registerYear", formData.register_year);
      fData.append("color", formData.vehicle_color);
      fData.append("licenseId", formData.lisence_id);
      fData.append("licenseExpireDate", formData.lisence_expire_date);
      fData.append("chassieNumber", formData.chassie_number);
      fData.append("fuelType", formData.fuel_type);
      fData.append("licenceLastUpdate", formData.lisence_last_date);
      fData.append("insuranceType", formData.insurance_type);
      fData.append("insuranceNo", formData.insurance_id);
      fData.append("insuranceExpireDate", formData.insurance_expire_date);
      fData.append("insuranceLastUpdate", formData.insurance_last_update);
      fData.append("brandId", formData.vehicle_brand);
      fData.append("licenceDocument", formData.lisence_document);
      fData.append("insuranceDocument", formData.insurance_document);
      fData.append("ecoDocument", formData.eco_document);

      console.log(...fData);

      // Fetching vehicle data using api
      const response = await apiService.put(
        `/vehicle/update/${vehicleId}`,
        fData
      );

      console.log(response);

      // Sending an error if response status !== (not equal ) to 201/200
      if (response.status !== 201) {
        toast.error("Vehicle data creation fail");
        return;
      }

      toast.success("Vehicle data creation success");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to create vehicle data"); // throwinf an error if vehicle creation process not successfull
    }
  };

  // fetch vehicle data with id
  const fetchVehicleByid = async (id) => {
    const response = await apiService.get(`vehicle/details/${id}`);

    setFormData({
      vehicle_title: response.data.data?.[0]?.model,
      type: response.data.data?.[0]?.vehicleType,
      category: response.data.data?.[0]?.vehicleTypeTwo,
      chassie_number: response.data.data?.[0]?.VehicleDetail?.chassieNumber,
      vehicle_color: response.data.data?.[0]?.VehicleDetail?.color,
      vehicle_brand: response.data.data?.[0]?.brandId,
      fuel_type: response.data.data?.[0]?.VehicleDetail?.fuelType,
      register_year: response.data.data?.[0]?.VehicleDetail?.registerYear,
    });
  };

  // fetching all the vehicle data in db
  const fetchVehicleData = async () => {
    try {
      const data = await apiService.get("brand/all");

      if (data.status !== 200) {
        toast.error("Brand data fetching error!!!");
      }

      setBrands(data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (vehicleId) {
      fetchVehicleByid(vehicleId);
    }
  }, [vehicleId]);

  useEffect(() => {
    fetchVehicleData();
  }, []);

  return (
    <>
      <div className="justify-center w-full">
        <div className="flex flex-row justify-center">
          <span className="text-2xl text-[#0F2043]">Edit vehicle Details</span>
        </div>
        <form onSubmit={handleSubmit}>
          <table>
            <tbody>
              <tr>
                <td className=" px-4 py-2 font-bold">Vehicle ID</td>
                <td>#{vehicleId}</td>
              </tr>

              <tr>
                <td className=" px-4 py-2 font-bold">Vehicle Type:</td>
                <td className="text-right px-4 py-2">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  >
                    <option value="" disabled selected>
                      Select vehicle Type
                    </option>
                    <option value="car">Car</option>
                    <option value="van">Van</option>
                    <option value="three-wheel">Three wheel</option>
                    <option value="bike">Bike</option>
                    <option value="cab">Cab</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td className=" px-4 py-2 font-bold">Vehicle Brand:</td>
                <td className="text-right px-4 py-2">
                  <select
                    name="vehicle_brand"
                    id="vehcile_brand"
                    value={formData.vehicle_brand}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  >
                    <option value="" disabled selected>
                      Select vehicle Type
                    </option>
                    {Array.isArray(brands) &&
                      brands.map((item, idx) => {
                        return (
                          <option value={item.id} key={idx}>
                            {item.title}
                          </option>
                        );
                      })}
                  </select>
                </td>
              </tr>

              <tr>
                <td className=" px-4 py-2 font-bold">Vehicle Model:</td>
                <td className="text-right px-4 py-2">
                  <input
                    type="text"
                    name="vehicle_title"
                    value={formData.vehicle_title}
                    onChange={handleInputChange}
                    // placeholder="Sunny"
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  />
                </td>
              </tr>

              <tr>
                <td className=" px-4 py-2 font-bold">Fuel Type:</td>
                <td className="text-right px-4 py-2">
                  <select
                    name="fuel_type"
                    value={formData.fuel_type}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  >
                    <option value="Petrol" selected>
                      Petrol
                    </option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td className=" px-4 py-2 font-bold">Vehicle Color:</td>
                <td className="text-right px-4 py-2">
                  <input
                    type="text"
                    name="vehicle_color"
                    value={formData.vehicle_color}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  />
                </td>
              </tr>

              <tr>
                <td className=" px-4 py-2 font-bold">Vehicle Category:</td>
                <td className="text-right px-4 py-2">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  >
                    <option value="" selected disabled>
                      Select vehicle category
                    </option>
                    <option value="H">Heavy</option>
                    <option value="L">Light</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td className=" px-4 py-2 font-bold">Chassie Number:</td>
                <td className="text-right px-4 py-2">
                  <input
                    type="text"
                    name="chassie_number"
                    value={formData.chassie_number}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  />
                </td>
              </tr>

              <tr>
                <td className=" px-4 py-2 font-bold">Registered Year:</td>
                <td className="text-right px-4 py-2">
                  <input
                    type="text"
                    name="register_year"
                    value={formData.register_year}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={isFocused}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md ${
                isFocused
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              {isFocused ? "Updating..." : "Update Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default VehicleEditCard;
