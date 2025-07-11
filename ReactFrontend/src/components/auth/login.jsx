import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { API_BASE_URL,ClientID } from "/config";
import { useNavigate } from 'react-router-dom';
import { GoogleLogin,GoogleOAuthProvider  } from '@react-oauth/google';



const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [csrftoken, setcsrftoken] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem("authToken");


  const handleGoogleSuccess = async (credentialResponse) => {
    console.log(credentialResponse)
    console.log("Google credential/token:", credentialResponse.credential);

    try {
      const res = await fetch(`${API_BASE_URL}account/dj-rest-auth/google/`, {
        method: 'POST',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          // "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({
          access_token: credentialResponse.credential,
          provider: 'google',
        }),
      });

      const data = await res.json();
      console.log(data)
      if (data.key) {
        localStorage.setItem('authToken', data.key); // Store token for later use
        console.log('Google login successful');
        navigate('/form'); // Redirect after login
      } else {
        console.error('Login failed:', data);
      }
    } catch (err) {
      console.error('Google login error', err);
    }
  };
     
    
    const handleSubmit = (e) => {
      e.preventDefault();
      // Placeholder for login logic
      if (!username || !password) {
        setError('Please enter both username and password.');
        return;
      }
      axios.post(`${API_BASE_URL}account/login/`,{username:username,password:password}).then((res) => {
        console.log(res.data);
        if (res.data.status === true){
          localStorage.setItem("authToken", res.data.data.token);
          window.location.href = `/`;
        }else{
          setError("invalid credential");
        }
      }).catch((err) => {
        console.log(err)
      });
      
    };
    console.log(csrftoken)
    useEffect(() =>{
      console.log(`${API_BASE_URL}account/auth/social/login/`);
      
    if (token){
      console.log(true)
      window.location.href = `/form`;
    }
  },[])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">Sign In</h2>
        <p className="mb-6 text-gray-500">Welcome back! Please login to your account.</p>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 mb-4 shadow-md"
          >
            Login
          </button>
        </form>
          <div className="text-center text-sm mt-4">
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')} className="text-purple-600 font-semibold cursor-pointer hover:underline" >
            Register
          </span>
        </div>
        <div className="w-full flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-2 text-gray-400 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>
        <GoogleOAuthProvider clientId={ClientID}>
          <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            console.log('Login Failed');
          }}
        />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default Login; 