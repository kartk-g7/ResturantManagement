
import React, { useState } from "react";
import { auth, db } from "../firebase";
import myImage from "../assets/image.png.png"; 

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCred.user.uid), {
        email,
        role: "admin",
      });

      const docSnap = await getDoc(doc(db, "users", userCred.user.uid));
      const role = docSnap.data()?.role;
      navigate(role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const docSnap = await getDoc(doc(db, "users", userCred.user.uid));
      const role = docSnap.data()?.role || "client";
      navigate(role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      setErrorMsg("Invalid email or password.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);
      const ref = doc(db, "users", userCred.user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, { email: userCred.user.email, role: "admin" });
      }

      const role = (await getDoc(ref)).data()?.role;
      navigate(role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      setErrorMsg("Google login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Full Image */}
      <div className="hidden md:flex w-1/2 relative">
        <img
          src={myImage}
          alt="Login illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Welcome 👋
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Login to continue to your dashboard
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold shadow-md"
            >
              Login
            </button>
          </form>

          <button
            onClick={handleSignup}
            className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-semibold shadow-md"
          >
            Sign Up
          </button>

          <button
            onClick={handleGoogleLogin}
            className="w-full mt-3 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition font-semibold shadow-md flex items-center justify-center gap-2"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Login with Google
          </button>

          {errorMsg && (
            <p className="mt-4 text-red-600 text-sm text-center">{errorMsg}</p>
          )}

          <p className="text-gray-500 text-center mt-6 text-sm">
            Don’t have an account?{" "}
            <span
              onClick={handleSignup}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Sign up here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
