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

  const handleSignup = async () => {
    try{
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', userCred.user.uid), {
      email,
      role: 'admin',
    });

    const docSnap = await getDoc(doc(db, 'users', userCred.user.uid));
    const role = docSnap.data()?.role;
    navigate(role === 'admin' ? '/admin' : '/dashboard');
    //navigate('/dashboard');
  }catch(error){
    setErrorMsg(error.message);
  }
  };

  const handleLogin = async () => {
    try{
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const docSnap = await getDoc(doc(db, 'users', userCred.user.uid));
      const role = docSnap.data()?.role || 'client';
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    }catch(error){
      setErrorMsg('Invalid email or password.');
    }
  };

  const handleGoogleLogin = async () => {
    try{
        const provider = new GoogleAuthProvider();
        const userCred = await signInWithPopup(auth, provider);
        const ref = doc(db, 'users', userCred.user.uid);
        const snap = await getDoc(ref);
 
          if (!snap.exists()) {
           await setDoc(ref, { email: userCred.user.email, role: 'admin' });
         }

         const role = (await getDoc(ref)).data()?.role;
         navigate(role === 'admin' ? '/admin' : '/dashboard');
        }catch(error){
            setErrorMsg('Google login failed. Please try again.');
        }
  };

  return (
    <div className="login">
      <h2>Login / Register</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleSignup}>Sign Up</button>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleGoogleLogin}>Login with Google</button>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

    </div>
  );
};

export default Login;
