import "./App.css";
import AllRoutes from "./Routes/routes";
import { AuthContextProvider } from "./contexts/AuthContext";
import { MantineProvider } from "@mantine/core";

function App() {
  return (
    <AuthContextProvider>
      <MantineProvider withGlobalStyles withNormalizeCSS>
          <AllRoutes />
      </MantineProvider>
    </AuthContextProvider>
  );
}

export default App;
