import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
// import Video from "./pages/Video";
import ProfilePage from "./pages/Profile";
import UploadVideo from "./pages/VideoUpload";
import Video from "./pages/Video";
import WatchHistory from "./components/WatchHistory";

const App = () => {
  const [SidebarNav, setSidebarNav] = useState(true);

  const [token, setToken] = useState(localStorage.getItem("AccessToken") || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("AccessToken", token);
    } else {
      localStorage.removeItem("AccessToken");
    }
  }, [token]);
const SidebarFunc=()=>{
  setSidebarNav((prev) => !prev);
}
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup setToken={setToken} />} />
        <Route path="/profile" element={<ProfilePage token={token} />} />

        <Route path="/" element={<Home SidebarNav={SidebarNav}  SidebarFunc={SidebarFunc}/>} />
        {/* <Route path="/video/:id" element={<Video />} /> */}
        <Route path="/upload" element={<UploadVideo/>}/>
        <Route path="/watch/:videoId" element={<Video />} />
        <Route path="history" element={<WatchHistory />} />



      </Routes>

      <Navbar
        Sidebar={SidebarNav}
        setSidebar={setSidebarNav}
      />
    </div>
  );
};

export default App;
