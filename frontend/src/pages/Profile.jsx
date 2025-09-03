import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Camera, MoreHorizontal } from "lucide-react";

const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
 const [video,setvideo]=useState([])
  const [activeForm, setActiveForm] = useState("");

  const token = localStorage.getItem("AccessToken");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        toast.error("No token found. Please login.");
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:3000/api/v1/users/currentuser",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCurrentUser(res.data.data);
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }
    };

    fetchProfile();

    const fetchVideo=async () => {
          if (!token) {
        toast.error("No token found. Please login.");
        return;
      }
      try {
        const response= await axios.get("http://localhost:3000/api/v1/videos/getmyvideos",
          {headers:{Authorization:`Bearer ${token}`}})    

          
       
          
          
          
setvideo(response.data.data)
      } catch (error) {
        toast.error(error.message)
      }
    }
    fetchVideo()
  }, [token]);

  const handleAvatarChange = async (e) => {
    const formData =  new FormData();
    formData.append("avatar", e.target.files[0]);
    try {
      const res = await axios.patch(
        "http://localhost:3000/api/v1/users/update-avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(res?.data?.message);
      setCurrentUser(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Avatar update failed");
    }
  };
  const handleCoverChange = async (e) => {
    const formData = new FormData();
    formData.append("coverImage", e.target.files[0]);
    try {
      const res = await axios.patch(
        "http://localhost:3000/api/v1/users/update-cover",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(res?.data?.message);
      setCurrentUser(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Cover update failed");
    }
  };
   const [formData,setFormData]=useState(
    {
      oldPassword:"",
      newPassword:""
    }
  )
  const handlePassChange= (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
const submitPassChange=async () => {
try {
    const res=await axios.patch("http://localhost:3000/api/v1/users/update-pass",formData,
      {
            headers: {
              Authorization: `Bearer ${token}`,
           
            },
          })
  console.log( "data",res.data);
 

  
          toast.success(res.data.message)
        
} catch (error) {
  toast.error( error.message)
}
}
const [username,setusername]=useState("")
const [email,setemail]=useState("")

const userUpdateSubmit=async () => {
  const res=await axios.patch("http://localhost:3000/api/v1/users/update-profile",{
    username,
    email
  },  {
            headers: {
              Authorization: `Bearer ${token}`,
           
            },
          })
  toast.success(res.data.message)



  

}
const [newComent,setnewComent]=useState("")
const handleDeleteComment = async (id) => {
  const token = localStorage.getItem("AccessToken");

  try {
    const res = await axios.delete(
      `http://localhost:3000/api/v1/coments/delete/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    
    setnewComent((prev) => prev.filter(comment => comment._id !== id));

    toast.success(res.data.message);
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete comment");
  }
};
const [title,settitle]=useState("")
const [discription,setdiscription]=useState("")
const [editable,seteditable]=useState(false)
const [thumbnail,setthumbnail]=useState("")
const handleVideoUpdate = async (id) => {
  try {
    const updatedData = { title, discription };

    await axios.patch(
      `http://localhost:3000/api/v1/videos/update/${id}`,
      updatedData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setvideo((prev) =>
      prev.map((vid) =>
        vid._id === id ? { ...vid, ...updatedData } : vid
      )
    );

    toast.success("Video updated successfully");
    seteditable(false);
if (thumbnail) {
      const formData = new FormData();
      formData.append("thumbnail", thumbnail);

      const { data } = await axios.put(
        `http://localhost:3000/api/v1/videos/updateFile/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setvideo((prev) =>
        prev.map((vid) =>
          vid._id === id ? { ...vid, thumbnail: data.thumbnailUrl } : vid
        )
      );
    }

    // Success message
    toast.success("Video updated successfully");
    seteditable(false);
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};


  return (<>
    <div className="max-w-4xl mx-auto pt-24 pb-10 space-y-8">
      {/* Cover Image */}
      <div className="relative w-full h-56 bg-gray-200 rounded-b-xl overflow-hidden shadow">
        <img
          src={currentUser?.coverImage || "https://via.placeholder.com/800x200"}
          alt="Cover"
          className="object-cover w-full h-full"
        />
        {/* Three-dot menu for cover */}
        <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition">
          <MoreHorizontal
            size={22}
            onClick={() => setMenuOpen((prev) => !prev)}
          />
          {menuOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white shadow-lg rounded-xl border border-gray-200">
              <ul className="flex flex-col">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setActiveForm("password")}
                >
                  Change Password
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setActiveForm("details")}
                >
                  Change User Detail
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setActiveForm("cover")}
                >
                  Change Cover Image
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Avatar */}
      <div className="relative -mt-16 ml-8 w-32 h-32">
        <img
          src={currentUser?.avatar || "https://via.placeholder.com/150"}
          alt="Avatar"
          className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
        />
        <label className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition">
          <Camera size={18} />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </label>
      </div>

      {/* User Info */}
      <div className="ml-8 mt-2">
        <h2 className="text-3xl font-bold text-gray-800">
          {currentUser?.username}
        </h2>
        <p className="text-gray-600 mt-1">{currentUser?.email}</p>
      </div>

      {/* Forms for menu options */}
      <div className="ml-8 mt-6 space-y-4">
        {activeForm === "password" && (
          <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
            <h3 className="font-semibold mb-2">Change Password</h3>
            <input
              type="password"
              placeholder="Old Password"
              name="oldPassword"
              className="w-full p-2 border rounded mb-2"
              value={formData.oldPassword}
              onChange={handlePassChange}
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 border rounded mb-2"
              name="newPassword"
              value={formData.newPassword}
              onChange={handlePassChange}

            />
            <button onClick={submitPassChange} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Update Password
            </button>
          </div>
        )}

        {activeForm === "details" && (
          <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
            <h3 className="font-semibold mb-2">Update Details</h3>
            <input
              type="text"
              placeholder="Username"
              name="username"
              className="w-full p-2 border rounded mb-2"
             
              onChange={(e)=>setusername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              className="w-full p-2 border rounded mb-2"
           
              onChange={(e)=>setemail(e.target.value)}
            />
           <button onClick={userUpdateSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
    Update Details
  </button>
          </div>
        )}

        {activeForm === "cover" && (
          <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
            <h3 className="font-semibold mb-2">Change Cover Image</h3>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded mb-2"
              onChange={handleCoverChange}
            />
            <button onClick={handleCoverChange} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              Update Cover
            </button>
          </div>
        )}
      </div>
    </div>

{/* Video Grid */}

<div className="max-w-6xl mx-auto px-4 py-8">
  <h2 className="text-2xl font-bold text-gray-800 mb-6">My Videos</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {video.map((vid) => (
      <div
        key={vid._id}
        className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
      >
        {/* Thumbnail */}
        
        <div className="relative">
         
          {/* Duration */}
          <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {new Intl.DateTimeFormat("en-GB", {
              minute: "2-digit",
              second: "2-digit",
            }).format(vid.duration * 1000)}
          </span>
        </div>

      
        <div className="p-4">
          {editable === vid._id ? (
            <>
              <img
              type="file"
            src={vid.thumbnail}
            alt={vid.title}
            className="w-full h-52 object-cover"
           onChange={(e)=>setthumbnail(e.target.files[0])}
          />
              <input
                type="text"
                value={title}
                onChange={(e) => settitle(e.target.value)}
                placeholder="Video Title"
                className="w-full p-2 border rounded mb-2"
              />
              <textarea
                value={discription}
                onChange={(e) => setdiscription(e.target.value)}
                placeholder="Video Description"
                className="w-full p-2 border rounded mb-2"
              />
              <button
                onClick={() => handleVideoUpdate(vid._id)}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => seteditable(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-1 px-3 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              {/* Normal Display */}
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {vid.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                {vid.discription}
              </p>
<div className="flex items-center space-x-2 text-sm text-gray-500">
  <p>{vid.views}views</p>

</div>

              {/* Video File Link */}
              <a
                href={vid.videoFile}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-indigo-600 font-medium text-sm hover:underline"
              >
                Watch Video
              </a>

              <div className="flex gap-3 mt-3">
                {/* Edit Button */}
                <button
                  onClick={() => {
                    seteditable(vid._id);
                    settitle(vid.title);
                    setdiscription(vid.discription);
                   
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded"
                >
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteComment(vid._id)}
                  className="px-4 py-2 rounded-2xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-300 shadow-md"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    ))}
  </div>
</div>
    </>
  );
};

export default Profile;     