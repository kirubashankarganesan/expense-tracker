import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import AppRoutes from "./routes/AppRoutes";
import { applyTheme, getStoredTheme } from "./utils/theme";

function App() {
  useEffect(() => {
    applyTheme(getStoredTheme());
  }, []);

  return (
    <>
      <AppRoutes />
      <ToastContainer
        autoClose={2600}
        closeOnClick
        draggable
        hideProgressBar={false}
        newestOnTop
        pauseOnFocusLoss={false}
        pauseOnHover
        position="top-right"
        theme="colored"
        toastClassName="app-toast"
      />
    </>
  );
}

export default App;
