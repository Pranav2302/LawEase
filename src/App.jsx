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
import AcceptCase from "./pages/AcceptCase";
import { GoogleOAuthProvider } from '@react-oauth/google';
import PrivateRoute from './pages/PrivateRoute';
// import CaseCreation from "./pages/1";
// import CaseCreation2 from "./pages/0";



function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="w-screen min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/leaderboard" element={<Leaderboard/>}/>
            <Route path="/providers" element={<Providers/>}/>
            {/* Client-only Routes */}
            <Route path="/create-case" element={
              <PrivateRoute roleRequired="Client">
                <CaseCreation />
              </PrivateRoute>
            } />

            {/* Provider-only Routes */}
            <Route path="/form" element={
              <PrivateRoute roleRequired="Provider">
                <Form />
              </PrivateRoute>
            } />
            <Route path="/accept-case" element={
              <PrivateRoute roleRequired="Provider">
                <AcceptCase />
              </PrivateRoute>
            } />

            {/* Protected Routes (any authenticated user) */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
          </Routes>
        </main>
        <Toaster />
      </div>
    </GoogleOAuthProvider>
  );
}
export default App;
