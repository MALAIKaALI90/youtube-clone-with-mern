import React, { useState } from "react";
import { Youtube } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom"
export default function Signup() {
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    fulname: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
    coverImage: null,
  });

  // handle inputs and file uploads separately
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // create FormData object for file uploads
      const data = new FormData();
      data.append("fulname", formData.fulname);
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      if (formData.avatar) data.append("avatar", formData.avatar);
      if (formData.coverImage) data.append("coverImage", formData.coverImage);

      console.log("Submitting form data:", formData);

      const response = await axios.post(
        "http://localhost:3000/api/v1/users/register",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      navigate("/")

      console.log("Response:", response.data);
      toast.success("You are registered successfully");

      setFormData({
        fulname: "",
        username: "",
        email: "",
        password: "",
        avatar: null,
        coverImage: null,
      });
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
      toast.error("Failed to register.");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <Youtube className="w-10 h-10 text-red-600" />
          <h1 className="ml-2 text-2xl font-bold text-red-600">YouTube Clone</h1>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
          Create Your Account
        </h2>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="fulname"
            placeholder="Full Name"
            value={formData.fulname}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />

          {/* Avatar Upload */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Upload Avatar
            </label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-gray-700"
              required
            />
            {formData.avatar && (
              <img
                src={URL.createObjectURL(formData.avatar)}
                alt="avatar preview"
                className="mt-2 w-20 h-20 object-cover rounded-full border"
              />
            )}
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Upload Cover Image
            </label>
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-gray-700"
            />
            {formData.coverImage && (
              <img
                src={URL.createObjectURL(formData.coverImage)}
                alt="cover preview"
                className="mt-2 w-full h-24 object-cover rounded-lg border"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
