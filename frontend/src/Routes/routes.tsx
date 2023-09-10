import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import LoginPage from "../pages/loginPage";
import { useAuthContext } from "../hooks/useAuthContext";
import RegisterPage from "../pages/registerPage";
import HomePage from "../pages/homePage";
import SiteHeader from "../components/SiteHeader/header";
import { QueryClient,QueryClientProvider } from "@tanstack/react-query";
import AdminLogin from "../pages/adminLogin";
import { useSignInAdmin } from "../hooks/useSignInAdmin,";
import { useAuthContextAdmin } from "../hooks/useAuthContextAdmin";
import AdminDashboard from "../pages/adminDashboard";
import DecideNav from "../components/decideNav/decideNav";


const AllRoutes = () => {

  const  {user} = useAuthContext();
  const {admin} = useAuthContextAdmin();

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
    <Router>
      <DecideNav/>
      <Routes>
        <Route path="/user/login" element={!user ? <LoginPage /> : <Navigate to={'/'}/>} />
        <Route path="/user/register" element={!user ? <RegisterPage/> : <Navigate to={'/'}/>}/>
        <Route path="/user" element={user ? <HomePage/> : <Navigate to={'/login'}/>}/>
        <Route path="/admin" element={!admin ? <AdminLogin/> : <Navigate to={"/admin/dashboard"}/>}/>
        <Route path="/admin/dashboard" element={ admin ? <AdminDashboard/> : <Navigate to={"/admin"}/>}/>

      </Routes>
    </Router>
    </QueryClientProvider>
  );
};

export default AllRoutes;
