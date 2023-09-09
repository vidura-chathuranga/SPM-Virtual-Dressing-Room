import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import LoginPage from "../pages/loginPage";
import { useAuthContext } from "../hooks/useAuthContext";
import RegisterPage from "../pages/registerPage";
import HomePage from "../pages/homePage";
import SiteHeader from "../components/SiteHeader/header";
import { QueryClient,QueryClientProvider } from "@tanstack/react-query";
const AllRoutes = () => {

  const  {user} = useAuthContext();
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
    <Router>
      <SiteHeader/>
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={'/'}/>} />
        <Route path="/register" element={!user ? <RegisterPage/> : <Navigate to={'/'}/>}/>


        <Route path="/" element={user ? <HomePage/> : <Navigate to={'/login'}/>}/>
      </Routes>
    </Router>
    </QueryClientProvider>
  );
};

export default AllRoutes;
