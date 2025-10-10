import { useState } from "react";
import { supabase } from "./supabaseClient";


export default function AuthPage() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 


  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.log('Signup error: ', error)
    }
    else {
      console.log('Successful sign up:', data)
    }

  }

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Signin error: ', error)
    }
    else {
      console.log('Successful sign in:', data)
    }
  }




  return (
    <div>
      <input type="email" value = {email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value = {password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={handleSignIn}>Log In</button>
    </div>
  );
}
