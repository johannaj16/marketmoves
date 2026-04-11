import { useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient"; 
import AuthPage from "./auth";
import Leaderboard from "./leaderboard";
import Portfolio from "./portfolioDashboard";
import SignUp from "./signUp";
import Trade from "./trade";
import './App.css';


function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth Event:", event);
      
      if (session) {

        console.log("User logged in:", session.user.email);
        navigate("/profile.tsx"); // Uncomment this when ready to redirect
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/trade" element={<Trade />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;