import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { API_BASE_URL } from "/config";


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const token = sessionStorage.getItem("authToken");


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
        sessionStorage.setItem("authToken", res.data.data.token);
        window.location.href = `/`;
      }else{
        alert("invalid credential");
      }
    }).catch((err) => {
      console.log(err)
    });
   
  };

  useEffect(() =>{
    if (token){
      console.log(true)
      window.location.href = `/form`;
    }
  },[])

  const handleGoogleLogin = () => {
    // Placeholder for Google login logic
    alert('Google login not implemented.');
  };

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
        <div className="w-full flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-2 text-gray-400 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-2 rounded-lg transition duration-200 shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <g>
              <path fill="#4285F4" d="M24 9.5c3.54 0 6.36 1.22 8.3 2.97l6.18-6.18C34.64 2.7 29.74 0 24 0 14.82 0 6.88 5.8 2.69 14.09l7.19 5.59C12.01 13.13 17.56 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.66 7.01l7.19 5.59C43.98 37.13 46.1 31.36 46.1 24.55z"/>
              <path fill="#FBBC05" d="M10.88 28.68A14.48 14.48 0 019.5 24c0-1.63.29-3.21.81-4.68l-7.19-5.59A23.93 23.93 0 000 24c0 3.77.9 7.34 2.5 10.45l8.38-5.77z"/>
              <path fill="#EA4335" d="M24 48c6.48 0 11.92-2.15 15.89-5.85l-7.38-5.73c-2.06 1.39-4.7 2.22-8.51 2.22-6.44 0-11.89-4.13-13.85-9.77l-8.38 5.77C6.88 42.2 14.82 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </g>
          </svg>
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login; 