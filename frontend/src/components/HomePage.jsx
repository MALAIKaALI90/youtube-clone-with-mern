import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";


export default function HomePage({ Sidebar }) {
  const [videos, setVideos] = useState([]);
const dummyVideos = [
  {
    _id: "dummy1",
    title: "Dummy Video 1",
    thumbnail: "https://i.ytimg.com/vi/ysz5S6PUM-U/maxresdefault.jpg",
    discription: "This is dummy description for video 1.",
    duration: 120,
    views: 150,
    videoFile: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    _id: "dummy2",
    title: "Dummy Video 2",
    thumbnail: "https://i.ytimg.com/vi/tgbNymZ7vqY/maxresdefault.jpg",
    discription: "This is dummy description for video 2.",
    duration: 200,
    views: 250,
    videoFile: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    _id: "dummy3",
    title: "Dummy Video 3",
    thumbnail: "https://i.ytimg.com/vi/aqz-KE-bpKQ/maxresdefault.jpg",
    discription: "This is dummy description for video 3.",
    duration: 300,
    views: 320,
    videoFile: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
  },
  {
    _id: "dummy4",
    title: "Dummy Video 4",
    thumbnail: "https://i.ytimg.com/vi/ScMzIvxBSi4/maxresdefault.jpg",
    discription: "This is dummy description for video 4.",
    duration: 95,
    views: 90,
    videoFile: "https://sample-videos.com/video123/mp4/720/sample_640x360.mp4",
  },
  {
    _id: "dummy5",
    title: "Dummy Video 5",
    thumbnail: "https://www.bing.com/th/id/OIP.U_VJuupQohwnzXcKMztqWgHaEo?w=248&h=211&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2",
    discription: "This is dummy description for video 5.",
    duration: 400,
    views: 540,
    videoFile: "https://sample-videos.com/video123/mp4/720/sample_960x400_ocean_with_audio.mp4",
  },
  {
    _id: "dummy6",
    title: "Dummy Video 6",
    thumbnail: "https://i.ytimg.com/vi/e-ORhEE9VVg/maxresdefault.jpg",
    discription: "This is dummy description for video 6.",
    duration: 180,
    views: 600,
    videoFile: "https://sample-videos.com/video123/mp4/720/sample_960x400_ocean.mp4",
  },
];
  const suggestions = [
    "All","Web Development","Pakistani Clothes","News","Music",
    "Gaming","Live","Sports","Comedy","Movies","Podcasts",
    "Cooking","Technology","Education"
  ];

  const fetchAllVideos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/videos/getAllVideos");
setVideos([...dummyVideos, ...res.data.data]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }

    
  };

  useEffect(() => {
    
    fetchAllVideos();

    
  }, []);

  return (
    <div className={`pt-14 ${Sidebar ? "ml-[240px]" : "ml-0"}`}>
      {/* Suggestions */}
      <div
        className={`fixed top-14 right-0 bg-white border-b border-gray-200 z-10 ${
          Sidebar ? "left-[240px]" : "left-0"
        }`}
      >
        <div
          className="flex gap-3 px-4 py-2 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
                idx === 0
                  ? "bg-black text-white font-medium"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 mt-16">
  {videos.map((video) => (
    <div
      key={video._id}
      className="flex flex-col cursor-pointer group"
    >
      {/* Internal link to watch page */}
      <Link to={`/watch/${video._id}`} className="block">
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Duration badge */}
          <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {new Intl.DateTimeFormat("en-GB", {
              minute: "2-digit",
              second: "2-digit",
            }).format(video.duration * 1000)}
          </span>
        </div>

        {/* Video Info */}
        <div className="flex mt-3 gap-3">
          {/* Channel avatar placeholder */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {video.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-3">
              {video.discription}
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <p>{video.views}views</p>
             
            </div>
          </div>
        </div>
      </Link>

      {/* External link (outside Link to avoid nesting) */}
      <a
        href={video.videoFile}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 text-indigo-600 font-medium text-sm hover:underline"
      >
        Watch Video
      </a>
    </div>
  ))}
</div>

    </div>
  );
}
