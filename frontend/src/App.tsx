import "./App.css";
import AllRoutes from "./Routes/routes";
import { AuthContextProvider } from "./contexts/AuthContext";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { AuthContextAdminProvider } from "./contexts/AuthContextAdmin";

function App() {
  return (
    <AuthContextProvider>
      <AuthContextAdminProvider>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <Notifications position="top-center" />
          <AllRoutes />
        </MantineProvider>
      </AuthContextAdminProvider>
    </AuthContextProvider>
  );
}

export default App;
