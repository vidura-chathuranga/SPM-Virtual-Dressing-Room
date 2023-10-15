import { useLocation } from "react-router-dom";
import SiteHeader from "../SiteHeader/header";

const DecideNav = () => {
  const location = useLocation();

  if (location.pathname === "/") {
    return <SiteHeader />;
  } else if (location.pathname === "/login") {
    return <SiteHeader />;
  } else if (location.pathname === "/register") {
    return <SiteHeader />;
  } else if (location.pathname.startsWith("/view/item")) {
    return <SiteHeader />;
  } else if (location.pathname.startsWith("/profile")) {
    return <SiteHeader />;
  } else if (location.pathname.startsWith("/payment-info")) {
    return <SiteHeader />;
  } else {
    return <></>;
  }
};

export default DecideNav;
