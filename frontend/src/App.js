import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import SearchResults from "@/pages/SearchResults";
import VehicleDetail from "@/pages/VehicleDetail";
import Apply from "@/pages/Apply";
import Login from "@/pages/Login";
import OperatorLogin from "@/pages/OperatorLogin";
import Register from "@/pages/Register";
import DriverPortal from "@/pages/DriverPortal";
import OperatorDashboard from "@/pages/OperatorDashboard";
import OperatorInterest from "@/pages/OperatorInterest";
import DriverGuide from "@/pages/DriverGuide";
import OperatorGuide from "@/pages/OperatorGuide";
import Admin from "@/pages/Admin";
import WhyCaro from "@/pages/WhyCaro";
import Help from "@/pages/Help";
import Legal from "@/pages/Legal";
import Calculator from "@/pages/Calculator";
import Saved from "@/pages/Saved";
import { api } from "@/lib/api";

function App() {
  useEffect(() => { api.get("/").catch(() => {}); }, []);
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/vehicle/:id" element={<VehicleDetail />} />
            <Route path="/apply/:id" element={<Apply />} />
            <Route path="/login" element={<Login />} />
            <Route path="/operator-login" element={<OperatorLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/portal" element={<DriverPortal />} />
            <Route path="/operator-dashboard" element={<OperatorDashboard />} />
            <Route path="/list-your-fleet" element={<OperatorInterest />} />
            <Route path="/driver-guide" element={<DriverGuide />} />
            <Route path="/operator-guide" element={<OperatorGuide />} />
            <Route path="/why-caro" element={<WhyCaro />} />
            <Route path="/help" element={<Help />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Footer />
          <Toaster position="top-center" richColors />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
