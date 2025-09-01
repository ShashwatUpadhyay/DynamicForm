import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from "/config";
import Swal from 'sweetalert2';
import { GoogleLogin,GoogleOAuthProvider  } from '@react-oauth/google';


const Registration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const ClientID = '180420409981-rbkrghn9nogc8nh7o3s58dcgl3s91nd2.apps.googleusercontent.com';
  
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(`${API_BASE_URL}account/dj-rest-auth/register/`, {
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

  const validatePassword = (password) => {
    const messages = [];
    if (password.length < 8) messages.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) messages.push('At least one uppercase letter');
    if (!/[a-z]/.test(password)) messages.push('At least one lowercase letter');
    if (!/[0-9]/.test(password)) messages.push('At least one number');
    if (!/[^A-Za-z0-9]/.test(password)) messages.push('At least one special character');
    return messages;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'password') setPasswordTouched(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.first_name) newErrors.first_name = 'First name is required';
    if (!form.last_name) newErrors.last_name = 'Last name is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.username) newErrors.username = 'Username is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (validatePassword(form.password).length > 0) newErrors.password = 'Password does not meet requirements';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      axios.post(`${API_BASE_URL}account/register/`,form).then((res) =>{
        console.log(res.data)
        if (res.data.status === true){
            Swal.fire({
                title: "Registrarion successfull!",
                icon: "success",
                draggable: true
              }).then(() => {
                navigate('/login');
              });
        }else{
            const newErrors = {};
            const err = res.data.error
            if (err.email) newErrors.email = err.email[0];
            if (err.username) newErrors.username = err.username[0];
            setErrors(newErrors);
        }
      }).catch((e) => {
        console.log(e);
      })
    }
  };

  const handleGoogleSignUp = () => {
    // Google sign up logic here
    alert('Google Sign Up not implemented');
  };

  const passwordValidationMessages = validatePassword(form.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple-100 to-pink-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4">
        <h2 className="text-3xl font-bold text-center text-purple-600 mb-2">Create Your Account</h2>
        <p className="text-center text-gray-500 mb-4">Join FormServe and start building beautiful forms today!</p>
        <div className="flex grid grid-cols-2 gap-2">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
        </div>
            {errors.first_name && <span className="text-red-500 text-sm mx-2">{errors.first_name}</span>}
            {errors.last_name && <span className="text-red-500 text-sm mx-2">{errors.last_name}</span>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        {errors.username && <span className="text-red-500 text-sm">{errors.username}</span>}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            onBlur={() => setPasswordTouched(true)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 w-full pr-10"
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.274.857-.67 1.664-1.175 2.393M15.54 15.54A8.963 8.963 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.014 9.014 0 012.042-3.362M9.88 9.88A3 3 0 0112 15a3 3 0 01-2.12-.88M9.88 9.88L4.22 4.22m0 0A9.014 9.014 0 002.458 12c1.274 4.057 5.065 7 9.542 7 2.042 0 3.97-.613 5.54-1.66m-1.66-1.66l5.66 5.66" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" /></svg>
            )}
          </button>
        </div>
        {passwordTouched && passwordValidationMessages.length > 0 && (
          <ul className="text-xs text-red-500 mb-2 list-disc ml-5">
            {passwordValidationMessages.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        )}
        {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 w-full pr-10"
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.274.857-.67 1.664-1.175 2.393M15.54 15.54A8.963 8.963 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.014 9.014 0 012.042-3.362M9.88 9.88A3 3 0 0112 15a3 3 0 01-2.12-.88M9.88 9.88L4.22 4.22m0 0A9.014 9.014 0 002.458 12c1.274 4.057 5.065 7 9.542 7 2.042 0 3.97-.613 5.54-1.66m-1.66-1.66l5.66 5.66" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" /></svg>
            )}
          </button>
        </div>
        {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword}</span>}
        <button
          type="submit"
          className="w-full py-2 mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
        >
          Register
        </button>
        {/* <div className="flex items-center my-2">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-2 text-gray-400 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div> */}
        {/* <button
          type="button"
          onClick={handleGoogleSignUp}
          className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 bg-white text-gray-700 font-semibold rounded-lg shadow hover:bg-gray-50 transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C35.64 2.7 30.18 0 24 0 14.82 0 6.71 5.82 2.69 14.29l7.98 6.2C12.36 13.36 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.36 46.1 31.36 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.84A14.5 14.5 0 019.5 24c0-1.68.29-3.3.8-4.84l-7.98-6.2A23.93 23.93 0 000 24c0 3.77.9 7.34 2.49 10.49l8.18-5.65z"/><path fill="#EA4335" d="M24 48c6.18 0 11.36-2.05 15.15-5.59l-7.19-5.6c-2.01 1.35-4.59 2.16-7.96 2.16-6.26 0-11.64-3.86-13.33-9.21l-8.18 5.65C6.71 42.18 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
          Sign up with Google
        </button> */}
        {/* <GoogleOAuthProvider clientId={ClientID}>
          <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            console.log('Login Failed');
          }}
        />
        </GoogleOAuthProvider> */}
        <div className="text-center text-sm mt-4">
          Already have an account?{' '}
          <span className="text-purple-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate('/login')}>
            Login
          </span>
        </div>
      </form>
    </div>
  );
};

export default Registration; 