import { Button } from "./components/ui/button";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import Signup from "./pages/Signup";
import Navbar from "./myComponents/Navbar";
import { Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard";
import Providers from "./pages/Providers";
import Leaderboard from "./pages/Leaderboard";
import Home from "./pages/Home";
import Form from "./pages/Form";
import { toast, Toaster } from 'sonner'
import CaseCreation from "./pages/CaseCreation";
// import CaseCreation from "./pages/1";
// import CaseCreation2 from "./pages/0";



function App() {
  return (
    <div className="w-screen min-h-screen flex flex-col">

      <Navbar/>
      <main className="flex-1 pt-16">
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-case" element={<CaseCreation />} />
        <Route path='/form' element={<Form />} />
        {/* <Route path="/create-case2" element={<CaseCreation2 />} /> */}
      </Routes>
      </main>
      <Toaster richColors position="bottom-center" />

    </div>
  );
}

export default App;
