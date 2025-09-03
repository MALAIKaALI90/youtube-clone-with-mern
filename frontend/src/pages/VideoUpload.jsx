import React, { useEffect, useState } from "react";
import { Youtube } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UploadVideo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    discription: "",
    videoFile: null,
    thumbnail: null,
  });

  // 🔐 Check if logged in
  useEffect(() => {
    const token = localStorage.getItem("AccessToken");
    if (!token) {
      toast.error("User is not logged in");
      navigate("/login");
    }
  }, [navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Upload video
  const handleVideoUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("AccessToken");

    if (!formData.videoFile) {
      toast.error("Please select a video file");
      return;
    }

    if (!formData.thumbnail) {
      toast.error("Please select a thumbnail");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("discription", formData.discription);
    data.append("videoFile", formData.videoFile);
    data.append("thumbnail", formData.thumbnail);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/videos/publishVideos",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);
      console.log("Response:", response.data);
      navigate("/"); // redirect after upload
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Upload failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-28 pb-10">
      <div className="w-full max-w-2xl p-8 bg-white shadow-xl rounded-2xl">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-gray-800">
          <Youtube className="w-6 h-6 text-red-600" /> Upload Your Video
        </h2>

        <form onSubmit={handleVideoUpload} className="space-y-5">
          {/* Video Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Upload Video File
            </label>
            <input
              type="file"
              name="videoFile"
              accept="video/*"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
              required
            />
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Upload Thumbnail
            </label>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              placeholder="Add a title that describes your video"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            <textarea
              name="discription"
              value={formData.discription}
              placeholder="Tell viewers about your video..."
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md"
          >
            Upload Video
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadVideo;
