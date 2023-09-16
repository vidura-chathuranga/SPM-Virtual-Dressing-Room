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
import SiteHeader from "../components/SiteHeader/header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminLogin from "../pages/adminLogin";
import { useSignInAdmin } from "../hooks/useSignInAdmin,";
import { useAuthContextAdmin } from "../hooks/useAuthContextAdmin";
import AdminDashboard from "../pages/adminDashboardAddItem";
import DecideNav from "../components/decideNav/decideNav";
import ManageHumanModelPage from "../pages/manageHumanModelPage";
import AdminFinance from "../pages/adminDashboardFinance";

const AllRoutes = () => {
  const { user } = useAuthContext();
  const { admin } = useAuthContextAdmin();
  console.log(admin);

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
          <Route path="/register" element={<RegisterPage />} />

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
          {/* <Route
            path="/user/login"
            element={!user ? <LoginPage /> : <Navigate to={"/user"} />}
          />
          <Route
            path="/user/register"
            element={!user ? <RegisterPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/user"
            element={user ? <HomePage /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/admin"
            element={
              !admin ? <AdminLogin /> : <Navigate to={"/admin/dashboard"} />
            }
          />
          <Route
            path="/admin/dashboard"
            element={admin ? <AdminDashboard /> : <Navigate to={"/admin"} />}
          />
                  <Route
            path="/add/managehuman"
            element={
              admin ? <ManageHumanModelPage /> : <Navigate to={"/admin"} />
            }
          /> */}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default AllRoutes;
