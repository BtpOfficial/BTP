// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
  
    lastName: '',
    email: '',
    password: '',
    Qualification: '',
    gender: '',
    category: '',
    // Additional fields
   
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make API request to register user
      const response = await axios.post('/api/register', formData);
      console.log(response.data);
    } catch (error) {
      console.error('Registration failed', error.message);
    }
  };

  return (
    <div className="bg-royal-blue min-h-screen flex items-center justify-center">
    <div className="bg-navy-blue p-8 rounded-lg shadow-2xl w-full max-w-md">
    <h2 className="text-2xl font-bold mb-8 text-black">Register</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-6">
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-600">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
         
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-600">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
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
              required
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
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Qualification" className="block text-sm font-medium text-gray-600">
            Qualification
            </label>
            <input
              type="text"
              id="mode"
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-600">
              Gender
            </label>
            <input
              type="text"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
         
       
        </div>
        <button
            type="submit"
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-500 focus:outline-none focus:shadow-outline-blue active:bg-orange-800"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
