import React, { useState } from 'react';
import { auth, db } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCred.user.uid), {
        email,
        role: 'admin',
      });

      const docSnap = await getDoc(doc(db, 'users', userCred.user.uid));
      const role = docSnap.data()?.role;
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const docSnap = await getDoc(doc(db, 'users', userCred.user.uid));
      const role = docSnap.data()?.role || 'client';
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      setErrorMsg('Invalid email or password.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);
      const ref = doc(db, 'users', userCred.user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, { email: userCred.user.email, role: 'admin' });
      }

      const role = (await getDoc(ref)).data()?.role;
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      setErrorMsg('Google login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login / Register</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <button
          onClick={handleSignup}
          className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          Sign Up
        </button>
        <button
          onClick={handleGoogleLogin}
          className="w-full mt-2 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
        >
          Login with Google
        </button>
        {errorMsg && <p className="mt-4 text-red-600 text-sm text-center">{errorMsg}</p>}
      </div>
    </div>
  );
};

export default Login;
