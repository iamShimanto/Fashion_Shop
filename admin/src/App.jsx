import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedAdmin from "./routes/ProtectedAdmin";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProductsList from "./pages/Products/ProductsList";
import ProductForm from "./pages/Products/ProductForm";
import OrdersList from "./pages/Orders/OrdersList";
import OrderDetails from "./pages/Orders/OrderDetails";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import UsersList from "./pages/Users/UsersList";
import UserDetails from "./pages/Users/UserDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="/products" element={<ProductsList />} />
            <Route
              path="/products/new"
              element={<ProductForm mode="create" />}
            />
            <Route path="/products/:id" element={<ProductForm mode="edit" />} />

            <Route path="/orders" element={<OrdersList />} />
            <Route path="/orders/:id" element={<OrderDetails />} />

            <Route path="/users" element={<UsersList />} />
            <Route path="/users/:id" element={<UserDetails />} />

            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
