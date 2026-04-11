import { useState } from "react";
import { supabase } from "./supabaseClient";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import googleIcon from "./assets/google_logo.png";
import appleIcon from "./assets/apple_icon.svg";
import NavBar from "./navBar";
import "./auth.css";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [user, setUser] = useState(null);

  const handleEChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleVChange = () => setVisibility(!visibility);

  const validFields = email.includes("@") && password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignIn();
  };

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || data === null) {
      console.log('Signin error: ', error);
      return;
    }

    const token = data?.session?.access_token;
    if (!token) return;

    const res = await fetch('http://127.0.0.1:8000/protected', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    setUser(json);
  };

  // --- NEW: GOOGLE SIGN IN LOGIC ---
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) console.error("Google Auth Error:", error.message);
  };

  return (
    <div className="signInDiv">
      <NavBar />
      <div className="signingIn">
        <h5>Login marketmoves</h5>
        <br />
        
        <form onSubmit={handleSubmit}>
          <div className="signInDiv_field">
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEChange}
              placeholder="Email"
              required
            />
          </div>
          <div className="signInDiv_field">
            <input
              id="password"
              type={visibility ? "text" : "password"}
              value={password}
              onChange={handlePChange}
              placeholder="Password"
              required
            />
            <span className="visibility_toggle" onClick={handleVChange}>
              {visibility ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </span>
          </div>
          <button type="submit" disabled={!validFields}>
            Continue
          </button>
        </form>

        <p>Or continue with</p>
        
        <div className="continueWith">
          <button type="button" onClick={handleGoogleLogin}>
            <div>
              <img src={googleIcon} alt="Google" />
              <p>Continue with Google</p>
            </div>
          </button>
          
          <button type="button">
            <div>
              <img src={appleIcon} alt="Apple" />
              <p>Continue with Apple</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}