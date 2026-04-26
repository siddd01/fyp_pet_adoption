import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AdminAuthProvider } from "./Context/AdminAuthContext.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { CartProvider } from "./Context/CartContext.jsx";
import { PaymentProvider } from "./Context/PaymentContext.jsx";
import { PetProvider } from "./Context/PetContext.jsx";
import { ProductProvider } from "./Context/ProductContext.jsx";
import { StaffProvider } from "./Context/StaffContext.jsx";
import "./index.css";
import "sweetalert2/dist/sweetalert2.min.css";
import { installAppDialogs } from "./utils/dialogs";

installAppDialogs();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <PaymentProvider>
      <ProductProvider>
        <CartProvider>
          <PetProvider>
            <AdminAuthProvider>
              <StaffProvider>
              <App />
              </StaffProvider>

            </AdminAuthProvider>

          </PetProvider>

        </CartProvider>

      </ProductProvider>
      </PaymentProvider>
    </AuthProvider>
  </React.StrictMode>
);
