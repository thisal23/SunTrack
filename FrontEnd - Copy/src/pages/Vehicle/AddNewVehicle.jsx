import React, { useEffect, useState } from "react";
import apiService from "../../config/axiosConfig";
import { toast } from "react-toastify";
import NavBar from "../../components/NavBar/NavBar";

// Sachini part

const AddNewVehicle = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [brands, setBrands] = useState([]); // creating array state to assign all the brands in db

  // fetching all the vehicle data in db
  const fetchVehicleData = async () => {
    try {
      const data = await apiService.get("vehicle/brand/all");

      if (data.status !== 200) {
        toast.error("Trip data fetching error!!!");
      }

      setBrands(data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Form Input data State ~~ Assigning form input values to a state
  const [formData, setFormData] = useState({
    vehicle_title: "",
    type: "",
    category: "H",
    chassie_number: "",
    vehicle_color: "",
    vehicle_brand: "BMW",
    fuel_type: "Petrol",
    register_year: "",
    lisence_id: "",
    lisence_last_date: "",
    lisence_expire_date: "",
    lisence_document: null,
    insurance_id: "",
    insurance_expire_date: "",
    insurance_type: "third-party",
    insurance_last_update: "",
    insurance_document: null,
    eco_document: null,
  });

  // handling form input changes input onChange event
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value, // if input type is a file getting 0 index of the value else directly assigning the value of input text
    });
  };

  // Handling form submit with all the input values
  const handleSubmit = async (e) => {
    e.preventDefault();

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

    const response = await apiService.post("/vehicle/vehicle/create", fData);

    console.log(response);

    if (response.status !== 201) {
      toast.error("Vehicle data creation fail");
    }

    toast.success("Vehicle data creation success");
  };

  useEffect(() => {
    fetchVehicleData();
  }, []);

  return (
    <>
      <NavBar />
      <div className="w-full p-6 bg-white shadow-md rounded-lg">
        <span className="text-3xl text-left text-black underline mr-2">
          Vehicle
        </span>
        <span className="text-3xl text-left text-black">&gt;</span>
        <span className="text-3xl text-left text-black ml-2">
          Add New Vehicle
        </span>
        <form
          action=""
          className="lg:flex mt-10 lg:flex-row lg:justify-between lg:w-full lg:gap-5"
        >
          <fieldset className="border border-gray-300 p-4 rounded-md w-full mb-4 lg:mb-0">
            <legend className="text-lg font-semibold px-2 text-gray-700">
              Vehicle Details
            </legend>

            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="font-medium text-gray-700">
                  Vehicle Title: <span className="text-red-500"></span>
                </label>
                <input
                  type="text"
                  name="vehicle_title"
                  value={formData.vehicle_title}
                  onChange={handleInputChange}
                  placeholder="Nissan Sunny"
                  className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium text-gray-700">
                  Vehicle Type:
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="block w-full py-2.5 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                >
                  <option value="" disabled>
                    Select vehicle Type
                  </option>
                  <option value="car">Car</option>
                  <option value="van">Van</option>
                  <option value="three-wheel">Three wheel</option>
                  <option value="bike">Bike</option>
                  <option value="cab">Cab</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-medium text-gray-700">
                  Vehicle Category:
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="block w-full py-2.5 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                >
                  <option value="H" selected>
                    Heavy
                  </option>
                  <option value="L">Light</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-medium text-gray-700">
                    Chassie Number:
                  </label>
                  <input
                    type="text"
                    name="chassie_number"
                    value={formData.chassie_number}
                    onChange={handleInputChange}
                    className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-700">
                    Vehicle Color:
                  </label>
                  <input
                    type="text"
                    name="vehicle_color"
                    value={formData.vehicle_color}
                    onChange={handleInputChange}
                    className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    placeholder="Aqua"
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-700">
                    Vehicle Brand:
                  </label>
                  <select
                    name="vehicle_brand"
                    id="vehcile_brand"
                    value={formData.vehicle_brand}
                    onChange={handleInputChange}
                    className="block w-full py-2.5 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                  >
                    {Array.isArray(brands) &&
                      brands.map((item, idx) => {
                        return (
                          <option value={item.id} key={idx}>
                            {item.title}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="font-medium text-gray-700">Fuel Type:</label>
                <select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleInputChange}
                  className="block w-full py-2.5 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-medium text-gray-700">
                  Registered Year:
                </label>
                <input
                  type="text"
                  name="register_year"
                  value={formData.register_year}
                  onChange={handleInputChange}
                  className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="border border-gray-300 p-4 rounded-md w-full">
            <legend className="text-lg font-semibold px-2 text-gray-700">
              Vehicle Document Info
            </legend>

            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="font-medium text-gray-700">
                  Vehicle Plate ID:
                </label>
                <input
                  type="text"
                  name="lisence_id"
                  value={formData.lisence_id}
                  onChange={handleInputChange}
                  className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700">
                    License Last Update:
                  </label>
                  <input
                    type="date"
                    name="lisence_last_date"
                    value={formData.lisence_last_date}
                    onChange={handleInputChange}
                    className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    placeholder="2020/05/12"
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-700">
                    License Expiry Date:
                  </label>
                  <input
                    type="date"
                    name="lisence_expire_date"
                    value={formData.lisence_expire_date}
                    onChange={handleInputChange}
                    className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    placeholder="2025/**/**"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="font-medium text-gray-700">
                  Upload License Document <small>(.pdf, .jpg, .jpeg)</small>
                </label>
                <input
                  type="file"
                  name="lisence_document"
                  onChange={handleInputChange}
                  className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="">
                  <label className="font-medium text-gray-700">
                    Insurance ID:
                  </label>
                  <input
                    type="text"
                    name="insurance_id"
                    value={formData.insurance_id}
                    onChange={handleInputChange}
                    className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                  />
                </div>

                <div className="">
                  <label className="font-medium text-gray-700">
                    Insurance Expiry Date:
                  </label>
                  <input
                    type="date"
                    name="insurance_expire_date"
                    value={formData.lisence_expire_date}
                    onChange={handleInputChange}
                    className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    placeholder="2026/**/**"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700">
                    Insurance Type:
                  </label>
                  <select
                    name="insurance_type"
                    value={formData.insurance_type}
                    onChange={handleInputChange}
                    className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                  >
                    <option value="third-party">Third Party Insurance</option>
                    <option value="full">Full Insurance</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-gray-700">
                    Insurance Last Update:
                  </label>
                  <input
                    type="date"
                    name="insurance_last_update"
                    value={formData.insurance_last_update}
                    onChange={handleInputChange}
                    className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    placeholder="2020/**/**"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="">
                  <label className="font-medium text-gray-700">
                    Upload Insurance Document <small>(.pdf, .jpg, .jpeg)</small>
                  </label>
                  <input
                    type="file"
                    name="insurance_document"
                    onChange={handleInputChange}
                    className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                  />
                </div>
                <div className="">
                  <label className="font-medium text-gray-700">
                    Upload ECO Document <small>(.pdf, .jpg, .jpeg)</small>
                  </label>
                  <input
                    type="file"
                    name="eco_document"
                    onChange={handleInputChange}
                    className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </fieldset>
        </form>
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-auto flex flex-row mr-0 ml-auto mt-5 py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition duration-200"
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default AddNewVehicle;
