import "./App.css";
import AllRoutes from "./Routes/routes";
import { AuthContextProvider } from "./contexts/AuthContext";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { CartContextProvider } from "./contexts/CartContext";

function App() {
  return (
    <CartContextProvider>
      <AuthContextProvider>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <Notifications position="top-center" />
          <AllRoutes />
        </MantineProvider>
      </AuthContextProvider>
    </CartContextProvider>
  );
}

export default App;
