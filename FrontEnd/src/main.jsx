import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import InfoPage from "./pages/InfoPage/InfoPage.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import TrackingPage from "./pages/TrackingPage/TrackingPage.jsx";
import ReportsPage from "./pages/ReportsPage/ReportsPage.jsx";
import MaintenancePage from "./pages/MaintenancePage/MaintenancePage.jsx";
import HistoryPage from "./pages/TrackingPage/HistoryPage.jsx";
import GeoFencePage from "./pages/TrackingPage/GeoFencePage.jsx";
import Idle from "./pages/ReportsPage/Idle.jsx";
import Distance from "./pages/ReportsPage/Distance.jsx";
import DailySummary from "./pages/ReportsPage/DailySummary.jsx";
import DailyDetail from "./pages/ReportsPage/DailyDetail.jsx";
import ViewAll from "./pages/Trip/ViewAll.jsx";
import Info from "./pages/Vehicle/Info.jsx";
import AddNewVehicle from "./pages/Vehicle/AddNewVehicle.jsx";
import AllVehicle from "./pages/Vehicle/AllVehicle.jsx";
import "./App.css";
import Login from "./components/authentication/Login.jsx";
import ResetPassword from "./components/authentication/resetPassword.jsx";
import CreatePassword from "./components/authentication/CreatePassword.jsx";
import Register from "./components/authentication/Register.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    path: "/register",
    element: <Register/>,
  },

  {
    path: "/",
    element: <Login/>,
  },
  {
    path: "/forgot-password",
    element: <ResetPassword/>,
  },
  {
    path: "/create-password",
    element: <CreatePassword/>,
  },

  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/info",
    element: <InfoPage />,
  },
  {
    path: "/tracking",
    element: <TrackingPage />,
  },
  {
    path: "/reports",
    element: <ReportsPage />,
  },
  {
    path: "/maintenance",
    element: <MaintenancePage />,
  },

  {
    path: "/history",
    element: <HistoryPage />,
  },
  {
    path: "/geofence",
    element: <GeoFencePage />,
  },
  {
    path: "/idle",
    element: <Idle />,
  },
  {
    path: "/dailyDetail",
    element: <DailyDetail />,
  },
  {
    path: "/dailySummary",
    element: <DailySummary />,
  },
  {
    path: "/distance",
    element: <Distance />,
  },
  {
    path: "/trips/pending-trips",
    element: <ViewAll />,
  },
  {
    path: "/vehicle/info",
    element: <Info />,
  },
  {
    path: "/vehicle/add-new",
    element: <AddNewVehicle />,
  },
  {
    path: "/vehicle/all",
    element: <AllVehicle />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
