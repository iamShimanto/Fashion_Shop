import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedAdmin from "./routes/ProtectedAdmin";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import ProductsList from "./pages/Products/ProductsList";
import ProductForm from "./pages/Products/ProductForm";
import Settings from "./pages/Settings";

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

            <Route
              path="/orders"
              element={
                <ComingSoon
                  title="Orders"
                  description="Order management is planned for your next routes."
                />
              }
            />
            <Route
              path="/analytics"
              element={
                <ComingSoon
                  title="Analytics"
                  description="Dashboard analytics is scaffolded for later."
                />
              }
            />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
