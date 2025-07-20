import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import routes from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
// import AuthRedirect from "./context/AuthRedirect";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        {/* <AuthRedirect /> */}
        <Toaster richColors position="top-center" />
        <RouterProvider router={routes} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
