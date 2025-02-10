import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminPage from "./pages/admin/AdminPage";
import Header from "./components/Header";
import LoginForm from "./components/LoginForm";
import Loaidat from './pages/admin/Loaidat';
import Batdongsan from "./pages/admin/Batdongsan";
function App() {
  return (
    <Router>
      <div className="App">
        {!(window.location.pathname.startsWith("/admin")) && <Header />}
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/loaidat" element={<Loaidat />} />
          <Route path="/admin/batdongsan" element={<Batdongsan />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
