import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "../pages/loginPage";
import { useAuthContext } from "../hooks/useAuthContext";
import RegisterPage from "../pages/registerPage";
import HomePage from "../pages/homePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserProfile from "../components/UserProfile";
import DecideNav from "../components/decideNav/decideNav";
import { useAuthContextAdmin } from "../hooks/useAuthContextAdmin";
import AdminDashboard from "../pages/adminDashboardAddItem";
import AdminFinance from "../pages/adminDashboardFinance";
import AdminLogin from "../pages/adminLogin";
import ManageHumanModelPage from "../pages/manageHumanModelPage";
import ViewItemPage from "../pages/viewItemPage";
import Customizer from "../components/customizer/customizer";
import ViewHumanModel from "../components/viewHumanModel/viewHumanModel";

const AllRoutes = () => {
  const { user } = useAuthContext();
  const { admin } = useAuthContextAdmin();

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <DecideNav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/register"
            element={!user ? <RegisterPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/profile"
            element={user ? <UserProfile /> : <Navigate to={"/login"} />}
          />
          <Route path="/garment/customize" element={<Customizer />} />

          {/* admin Routes */}
          <Route
            path="/admin/login"
            element={
              !admin ? (
                <AdminLogin />
              ) : (
                <Navigate to={"/admin/dashboard/addItem"} />
              )
            }
          />
          <Route
            path="/admin/dashboard/addItem"
            element={
              admin ? <AdminDashboard /> : <Navigate to={"/admin/login"} />
            }
          />
          <Route
            path="/admin/dashboard/finance"
            element={
              admin ? <AdminFinance /> : <Navigate to={"/admin/login"} />
            }
          />
          <Route
            path="/admin/dashboard/managehuman"
            element={
              admin ? (
                <ManageHumanModelPage />
              ) : (
                <Navigate to={"/admin/login"} />
              )
            }
          />
          <Route
            path="/view/item/:id"
            element={user ? <ViewItemPage /> : <Navigate to={"/"} />}
          />
          <Route path="/view/human/:url" element={<ViewHumanModel />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default AllRoutes;
