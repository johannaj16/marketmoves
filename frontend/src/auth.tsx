import { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // need to wrap this in a try catch
  const signup = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Signed up!");
  };

  // need to wrap this in a try catch
  const login = async () => {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Logged in!");
  };


    const sendTokenToBackend = async () => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        const res = await fetch("http://localhost:8000/protected", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        console.log(data);
    }
    };


  return (
    <div>
      <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={signup}>Sign Up</button>
      <button onClick={login}>Log In</button>
    </div>
  );
}
