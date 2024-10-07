import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../src/pages/Login";
import Signup from "../src/pages/Signup";
import Navbar from "../src/myComponents/Navbar";
//import { Route, Routes } from "react-router";
import Dashboard from "../src/pages/Dashboard";
import Providers from "../src/pages/Providers";
import Leaderboard from "../src/pages/Leadboard";
import Home from "../src/pages/Home";
import Oauth from "../src/pages/Oauth";
import { toast, Toaster } from 'sonner'



function App() {
  return (
    <div className="w-screen min-h-screen flex flex-col">

      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Oauth" element={<Oauth />} />
      </Routes>
      <Toaster richColors position="bottom-center" />

    </div>
  );
}

export default App;
