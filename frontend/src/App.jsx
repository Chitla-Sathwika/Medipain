import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import AIChatWidget from "./components/AIChatWidget.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import SearchTest from "./pages/SearchTest.jsx";
import SearchMedicine from "./pages/SearchMedicine.jsx";
import Upload from "./pages/Upload.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AIAssistant from "./pages/AIAssistant.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/search-test" element={<SearchTest />} />
          <Route path="/search-medicine" element={<SearchMedicine />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <AIChatWidget />
    </div>
  );
}
