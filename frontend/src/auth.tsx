import { useState } from "react";
import { supabase } from "./supabaseClient";


export default function AuthPage() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [user, setUser] = useState(null);


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

    if (error || data === null) {
      console.log('Signin error: ', error)
      return
    }
    else {
      console.log('Successful sign in:', data)
    }

    if (data.session === null)
    {
      console.log("Session not returned")
      alert("idk alert the user of something")
      return
    }

    const token = data?.session?.access_token;

    if (token === null)
    {
      console.log("missing token")
      return
    }

    const res = await fetch('http://127.0.0.1:8000/protected', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json()
    
    setUser(json)
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
