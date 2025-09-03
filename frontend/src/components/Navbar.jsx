import { Menu, Search, Mic, Video, Bell,EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"
import { useNavigate } from "react-router-dom";
export default function Navbar({Sidebar,SidebarFunc}) {
  const navigate=useNavigate()
  const [userPic] = useState(
    "https://www.bing.com/th/id/OIP.7O4_GREtLbxqPdJCTmfatQHaHa?w=210&h=211&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2"
  );

  const [showDropdown, setShowDropdown] = useState(false);
 const setSidebarFunc=()=>{
  SidebarFunc(!Sidebar)
 }

 const handleLogout = async () => {
    try {
     const token= localStorage.getItem("AccessToken")
      await axios.post("http://localhost:3000/api/v1/users/logout",{},{
        headers:{Authorization:`Bearer ${token}`}
      });

   
      localStorage.removeItem("AccessToken");

     
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };


  return (
    <>
      {/* Navbar */}
      <nav  className="flex items-center justify-between px-4 py-2 bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        {/* Left Section */}
        <div className="flex items-center gap-4">
        <Menu
  onClick={setSidebarFunc}
  className="w-6 h-6 cursor-pointer"
/>
 <Link to="/">
          <img   
            src="https://www.gstatic.com/youtube/img/branding/youtubelogo/svg/youtubelogo.svg"
            alt="YouTube Logo"
            className="h-6 cursor-pointer"
          />
          </Link>
        </div>

        {/* Middle Section (Search) */}
        <div className="flex items-center flex-1 justify-center max-w-xl px-4">
          <div className="flex w-full border border-gray-300 rounded-full overflow-hidden">
            <input
              type="text"
              placeholder="Search"
              className="flex-1 px-4 py-1 outline-none"
            />
            <button className="px-4 bg-gray-100 hover:bg-gray-200">
              <Search className="w-5 h-5" />
            </button>
          </div>
          <button className="ml-3 p-2 rounded-full hover:bg-gray-100">
            <Mic className="w-5 h-5" />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 relative">
         <Link to={"/upload"}><Video className="w-6 h-6 cursor-pointer" /></Link>
          <Bell className="w-6 h-6 cursor-pointer" />
          <img
            onClick={() => setShowDropdown((prev) => !prev)}
            src={userPic}
            alt="Profile"
            className="w-8 h-8 rounded-full cursor-pointer"
          />

          {/* Profile Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 top-12 w-48 bg-white shadow-lg rounded-xl border border-gray-200">
              <ul className="flex flex-col">
                <Link to ={"/profile"} ><li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Profile
                </li></Link>
              <Link to={"/login"}> <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Login
                </li></Link> 
                <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>


      
    </>
  );
}
