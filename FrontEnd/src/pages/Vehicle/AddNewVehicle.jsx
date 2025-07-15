import React, { useEffect, useState } from "react";
import apiService from "../../config/axiosConfig";
import { toast, ToastContainer } from "react-toastify";
import NavBar from "../../components/NavBar/NavBar";
import AddTypeCard from "./AddTypeCard";
import AddBrandCard from "./AddBrandCard";
import AddModelCard from "./AddModelCard";
import { Modal } from "antd";

const AddNewVehicle = () => {
  const [vehicleTypes, setVehicleTypes] = useState([
    "Bike",
    "Three-Wheel",
    "Car",
    "Van",
    "Cab",
    "Lorry",
    "Bus",
    "Other",
  ]);
  const [newType, setNewType] = useState("");
  const [isModal_typeOpen, setIsModal_typeOpen] = useState(false);
  const [isModal_brandOpen, setIsModal_brandOPen] = useState(false);
  const [isModal_modelOpen, setIsModal_modelOPen] = useState(false);

  const handleCancel_type = () => {
    setIsModal_typeOpen(false);
  };
  const handleCancel_model = () => {
    setIsModal_modelOPen(false);
  };
  const handleCancel_brand = () => {
    setIsModal_brandOPen(false);
  };

  const [isFocused, setIsFocused] = useState(false);
  const [brands, setBrands] = useState([]);
  const [titles, setModels] = useState([]);

  // Override root max-width for this page only
  useEffect(() => {
    // Add CSS to override max-width
    const style = document.createElement("style");
    style.id = "addnewvehicle-root-override";
    style.textContent = `
      body.addnewvehicle-page #root {
        max-width: none !important;
      }
    `;
    document.head.appendChild(style);

    // Add class to body
    document.body.classList.add("addnewvehicle-page");

    // Cleanup function
    return () => {
      document.body.classList.remove("addnewvehicle-page");
      const styleElement = document.getElementById(
        "addnewvehicle-root-override"
      );
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  // fetching all the vehicle data in db
  const fetchVehicleData = async () => {
    try {
      const brandResponse = await apiService.get("brand/all");
      const modelResponse = await apiService.get("model/all");

      console.log(modelResponse.data.data);

      if (brandResponse.status !== 200 || modelResponse.status !== 200) {
        toast.error("Data fetching error!!!");
      }

      setBrands(brandResponse.data.data);
      setModels(modelResponse.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Form Input data State
  const [formData, setFormData] = useState({
    vehicle_title: "",
    vehicle_type: "",
    category: "",
    chassie_number: "",
    vehicle_color: "",
    vehicle_brand: "",
    fuel_type: "",
    register_year: "",
    vehicle_image: "",
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
    gps_id: "",
    country_code: "",
    device_sim_no: "",
    vehicle_model: "",
  });

  // handling form input changes
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  // Create new vehicle with data
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fData = new FormData();

      fData.append("vehicleType", formData.vehicle_type);
      fData.append("category", formData.category);
      fData.append("vehicleModel", formData.vehicle_model);
      fData.append("model", formData.register_year);
      fData.append("registerYear", formData.register_year);
      fData.append("vehicleImage", formData.vehicle_image);
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
      fData.append("gpsId", formData.gps_id);
      fData.append("countryCode", formData.country_code);
      fData.append("deviceSimNo", formData.device_sim_no);

      console.log(...fData);

      const response = await apiService.post("vehicle/create", fData);

      console.log(response);

      if (response.status !== 201) {
        toast.error("Vehicle data creation fail");
        return;
      }

      toast.success("Vehicle data creation success");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to create vehicle data");
    }
  };

  useEffect(() => {
    fetchVehicleData();
  }, []);

  return (
    <>
      <ToastContainer />
      <NavBar />
      <div className="min-h-screen w-full p-6 text-black bg-gray-100">
        <div className="flex flex-row justify-between items-center my-5">
          <span className="text-xl text-[#0F2043] font-semibold">
            Vehicle &gt; Add New Vehicle
          </span>
        </div>

        <div className="border-b-1 border-gray-300 w-full mb-5"></div>
        <form
          onSubmit={handleSubmit}
          className="lg:flex mt-10 lg:flex-col lg:justify-between lg:w-full lg:gap-5 customClassForm"
        >
          <div className="flex flex-row">
            <fieldset className="border border-gray-300 p-4 rounded-md w-full mb-4 lg:mb-0">
              <legend className="text-lg font-semibold px-2 text-gray-700">
                Vehicle Details
              </legend>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 w-full">
                  <div className="flex flex-row justify-start items-center text-left gap-4">
                    <div className="flex flex-col w-full">
                      <label className="font-medium text-gray-700">
                        Vehicle Type:
                      </label>

                      <div className="flex flex-row justify-between items-center w-full gap-4">
                        <select
                          name="vehicle_type"
                          id="vehicle_type"
                          value={formData.vehicle_type}
                          onChange={handleInputChange}
                          className="block flex-grow-3 py-2.5 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                        >
                          <option value="" disabled>
                            Select vehicle type
                          </option>
                          {vehicleTypes.map((types, idx) => (
                            <option key={idx} value={types}>
                              {types}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => setIsModal_typeOpen(true)}
                        className="bg-{#0F2043}-600 text-white px-4 py-2 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-row justify-start items-center text-left gap-4">
                      <div className="flex flex-col w-full">
                        <label className="font-medium text-gray-700">
                          Vehicle Brand:
                        </label>

                        <div className="flex flex-row justify-between items-center w-full gap-4">
                          <select
                            name="vehicle_brand"
                            id="vehicle_brand"
                            value={formData.vehicle_brand}
                            onChange={handleInputChange}
                            className="block w-full py-2.5 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                          >
                            <option value="" disabled>
                              Select vehicle brand
                            </option>
                            {Array.isArray(brands) &&
                              brands.map((item, idx) => {
                                return (
                                  <option
                                    value={item.id}
                                    key={idx}
                                    className="text-black"
                                  >
                                    {item.title}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>

                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => setIsModal_brandOPen(true)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-row justify-start items-center text-left gap-4">
                      <div className="flex flex-col w-full">
                        <label className="font-medium text-gray-700">
                          Vehicle Model:
                        </label>

                        <div className="flex flex-row justify-between items-center w-full gap-4">
                          <select
                            name="vehicle_model"
                            id="vehcile_model"
                            value={formData.vehicle_model}
                            onChange={handleInputChange}
                            className="block w-full py-2.5 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                          >
                            <option value="" disabled>
                              Select vehicle model
                            </option>
                            {Array.isArray(titles) &&
                              titles.map((item, idx) => {
                                return (
                                  <option
                                    value={item.id}
                                    key={idx}
                                    className="text-black"
                                  >
                                    {item.title}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => setIsModal_modelOPen(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="font-medium text-gray-700">
                        Fuel Type:
                      </label>
                      <select
                        name="fuel_type"
                        value={formData.fuel_type}
                        onChange={handleInputChange}
                        className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                      </select>
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
                        placeholder="White"
                      />
                    </div>

                    <div>
                      <label className="font-medium text-gray-700">
                        Vehicle Category:
                      </label>

                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="block w-full py-2.5 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                      >
                        <option value="" disabled>
                          Select vehicle category
                        </option>
                        <option value="H">Heavy</option>
                        <option value="L">Light</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
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

                  <div className="flex flex-col">
                    <label className="font-medium text-gray-700">
                      Upload Vehicle Image <small>(.jpg, .jpeg)</small>
                    </label>
                    <input
                      type="file"
                      name="vehicle_image"
                      value={formData.vehicle_image}
                      onChange={handleInputChange}
                      accept=".jpg,.jpeg,.png"
                      className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    />
                  </div>
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
                    accept=".pdf,.jpg,.jpeg,.png"
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
                      value={formData.insurance_expire_date}
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
                      Upload Insurance Document{" "}
                      <small>(.pdf, .jpg, .jpeg)</small>
                    </label>
                    <input
                      type="file"
                      name="insurance_document"
                      onChange={handleInputChange}
                      accept=".pdf,.jpg,.jpeg,.png"
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
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </fieldset>

            <fieldset className="border border-gray-300 p-4 rounded-md w-full">
              <legend className="text-lg font-semibold px-2 text-gray-700">
                GPS Device Data
              </legend>

              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700">
                    GPS Device ID:
                  </label>
                  <input
                    type="text"
                    name="gps_id"
                    value={formData.gps_id}
                    onChange={handleInputChange}
                    className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">
                    Country Code:
                  </label>
                  <input
                    type="text"
                    name="country_code"
                    value={formData.country_code}
                    onChange={handleInputChange}
                    className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-700">
                    Device Sim Number:
                  </label>
                  <input
                    type="text"
                    name="device_sim_no"
                    value={formData.device_sim_no}
                    onChange={handleInputChange}
                    className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                  />
                </div>
              </div>
            </fieldset>
          </div>
          <button
            type="submit"
            className="addnewveh__Btn w-auto flex flex-row mr-0 ml-auto mt-5 py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>

      <Modal
        open={isModal_typeOpen}
        onCancel={handleCancel_type}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <AddTypeCard
          isOpen={isModal_typeOpen}
          onClose={() => setIsModal_typeOpen(false)}
        />
      </Modal>

      <Modal
        open={isModal_modelOpen}
        onCancel={handleCancel_model}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <AddModelCard
          isOpen={isModal_modelOpen}
          onClose={() => setIsModal_modelOPen(false)}
        />
      </Modal>

      <Modal
        open={isModal_brandOpen}
        onClose={handleCancel_brand}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <AddBrandCard
          isOpen={isModal_brandOpen}
          onClose={() => setIsModal_brandOPen(false)}
        />
      </Modal>
    </>
  );
};

export default AddNewVehicle;
