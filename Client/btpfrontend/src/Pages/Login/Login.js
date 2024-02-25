// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make API request to login user
      const response = await axios.post('/api/login', formData);
      console.log(response.data);
    } catch (error) {
      console.error('Login failed', error.message);
    }
  };

  return (
    <div className="##243c5a min-h-screen flex items-center justify-center">
    <div className="#061d3c p-8 rounded-lg shadow-2xl w-full max-w-md">
      <h2 className="text-2xl font-bold mb-8 text-black">LOGIN</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <button
  type="submit"
  className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:shadow-outline-orange active:bg-orange-800"
>
  Login
</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
