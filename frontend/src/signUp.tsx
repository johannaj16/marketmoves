import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import googleIcon from "./assets/google_logo.png";
import appleIcon from "./assets/apple_icon.svg";
import NavBar from "./navBar";
import "./signUp.css";
import { supabase } from "./supabaseClient";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visibility, setVisibility] = useState(false);

  // --- LOGIC FUNCTIONS ---
  const handleUChange = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
  const handleEChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleVChange = () => setVisibility(!visibility);

  const handleGoogleLogin = async (e: React.MouseEvent) => {
    e.preventDefault(); // Stop any accidental form behavior
    console.log("Google Login Clicked!"); // This helps us see if the button is working

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:5173/portfolioDashboard'
      },
    });

    if (error) console.error("Supabase Error:", error.message);
  };

  const validFields = username !== "" && email.includes("@") && password.length >= 8;

  return (
    <div className="signUpDiv">
      <NavBar />
      <div className="registration">
        <h5>Join marketmoves</h5>
        <p>Embark on your investment journey without a single dollar.</p>
        <br />
        
        <form className="manual-signup-form">
          <div className="signUpDiv_field">
            <input id="username" type="text" value={username} onChange={handleUChange} placeholder="Username" required />
          </div>
          <div className="signUpDiv_field">
            <input id="email" type="email" value={email} onChange={handleEChange} placeholder="Email" required />
            {email !== "" && !email.includes("@") && <p>Valid email is required</p>}
          </div>
          <div className="signUpDiv_field">
            <input id="password" type={visibility ? "text" : "password"} value={password} onChange={handlePChange} placeholder="Password" required />
            <span className="visibility_toggle" onClick={handleVChange}>
              {visibility ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </span>
            {password !== "" && password.length < 8 && <p>Password must be at least 8 characters</p>}
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

export default SignUp;