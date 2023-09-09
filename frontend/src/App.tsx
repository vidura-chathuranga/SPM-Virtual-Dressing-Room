import "./App.css";
import AllRoutes from "./Routes/routes";
import { AuthContextProvider } from "./contexts/AuthContext";
import { MantineProvider } from "@mantine/core";
import {Notifications} from '@mantine/notifications';

function App() {
  return (
    <AuthContextProvider>
      <MantineProvider withGlobalStyles withNormalizeCSS>
      <Notifications position="top-center"/>
          <AllRoutes />
      </MantineProvider>
    </AuthContextProvider>
  );
}

export default App;
