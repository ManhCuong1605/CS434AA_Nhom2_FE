import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminPage from "./pages/admin/AdminPage";
import Header from "./components/Header";
import LoginForm from "./components/LoginForm";
import Loaidat from './pages/admin/Loaidat'; // Import Loaidat

function App() {
  return (
    <Router>
      <div className="App">
        {!(window.location.pathname.startsWith("/admin")) && <Header />}
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/loaidat" element={<Loaidat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
