import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
const Video = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);

 const getOneVideo = async (id) => {
    try {
     
      const res = await axios.get(`http://localhost:3000/api/v1/videos/${id}`);
      let videoData = res.data;
      const viewRes = await axios.post(`http://localhost:3000/api/v1/videos/views/${id}`);
      if (viewRes.message ) {
        videoData = viewRes.data.message
      }


      // 3. Update state with latest video
      setVideo(videoData);
    } catch (err) {
      console.error("Error fetching video:", err);
    }
  };
  const [likes,setLikes]=useState(0)
  const [liked,setLiked]=useState(false)
const toggleVideoLike=async (videoId) => {
  const token=localStorage.getItem("AccessToken")

  const res=await axios.get(`http://localhost:3000/api/v1/like/like/${videoId}`,
      { headers: { Authorization: `Bearer ${token}` } }
  )


 
  
  toast.success(res.data.message)
setLikes(res.data.likesCount)
 setLiked(res.data.isLiked);
}

const [content, setContent] = useState("");   // input box
const [comments, setComments] = useState([]); // list of comments
const handleAddComment = async (videoId) => {
  const token = localStorage.getItem("AccessToken");

  const res = await axios.post(
    `http://localhost:3000/api/v1/coments/coment/${videoId}`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  toast.success(res.data.message);

  // Add new comment to list
  setComments((prev) => [...prev, res.data.comment]);

  // Clear input box
  setContent("");
};

const toggleComentLike = async (id) => {
  
  try {
    const token = localStorage.getItem("AccessToken");
    const res = await axios.post(
      `http://localhost:3000/api/v1/like/like/${id}`,
     {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success(res.data.message);




  
    setComments((prev) =>
      prev.map((coment) =>
        coment._id === id
          ? { ...coment, likesCount: res.data.likesCount, isLiked: res.data.isLiked }
          : coment
      )
    );
  } catch (error) {
    toast.error(error.message);
  }
};
const [newComent, setnewComent] = useState("");
const [editable, setEditable] = useState(null); // stores the _id of the comment being edited

const handleUpdateComment = async (id) => {
  const token = localStorage.getItem("AccessToken");
  try {
    const res = await axios.put(
      `http://localhost:3000/api/v1/coments/edit/${id}`,
      { newComent },
      { headers: { Authorization: `Bearer ${token}` } }
    );

  setComments((prev) =>
  prev.map((comment) =>
    comment._id === id
      ? { ...comment, content:res.data.data.content }
      : comment
  )
);
console.log("updated com",res.data.data.content);

    setEditable(null); 
    setnewComent(""); 
       toast.success(res.data.message);
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

const handleDeleteComment = async (id) => {
  const token = localStorage.getItem("AccessToken");

  try {
    const res = await axios.delete(
      `http://localhost:3000/api/v1/coments/delete/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Remove the deleted comment from state
    setComments((prev) => prev.filter((comment) => comment._id !== id));

    toast.success(res.data.message);
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete comment");
  }
};const [currentuser,setCurrentUser]=useState()
useEffect(() => {



 
      const fetchProfile = async () => {
        const token=localStorage.getItem("AccessToken")
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
  if (!videoId) return;

  // Fetch video details
  getOneVideo(videoId);

  // Fetch video likes
  const fetchVideoLikes = async () => {
    try {
      const token = localStorage.getItem("AccessToken");
      const res = await axios.get(
        `http://localhost:3000/api/v1/like/like/${videoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLikes(res.data.likesCount);
      setLiked(res.data.isLiked);
    } catch (err) {
      console.error("Error fetching video likes:", err);
    }
  };

  // Fetch all comments
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/coments/All/${videoId}`
      );
      setComments(res.data.allcoment);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  fetchVideoLikes();
  fetchComments();
}, [videoId]);



  if (!video) {
    return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  }
  return (
    <div className="max-w-6xl mx-auto mt-20 px-4">
      {/* --- Video Player --- */}
      <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg">
        <video
          src={video.videoFile}
          poster={video.thumbnail}
          controls
          className="w-full h-full object-cover"
        />
      </div>

      {/* --- Title --- */}
      <h1 className="text-2xl font-bold mt-4 text-gray-900">{video.title}</h1>

      {/* --- Stats & Actions --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 text-gray-600 text-sm gap-3">
        <p>
          {video.views} views 
         
        </p>
         {new Date(video.createdAt).toLocaleDateString()}
        <div className="flex items-center gap-3">
           <div>
      <button onClick={() => toggleVideoLike(videoId)}>
        {liked ? "👍 Liked" : "  👎 Like"} ({likes})
      </button>
    </div>
       
          <button className="px-3 py-1 bg-gray-100 rounded-full hover:bg-blue-100 transition">
            Share
          </button>
        </div>
      </div>

      {/* --- Channel Info --- */}
      <div className="flex items-center justify-between border-t border-b py-4 mt-5">
        <div className="flex items-center gap-3">
          <img
            src={video.owner.avatar }
            alt="channel avatar"
            className="w-12 h-12 rounded-full border"
          />
          <div>
            <h3 className="font-semibold text-gray-900">
              {video.owner?.username || "Channel Name"}
            </h3>
            <p className="text-gray-500 text-sm">
              0 subscribers
            </p>
          </div>
        </div>
        <button className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition">
          Subscribe
        </button>
      </div>

      {/* --- Description --- */}
      <div className="mt-4 bg-gray-50 p-4 rounded-xl shadow-sm">
        <p className="text-gray-800 whitespace-pre-line leading-relaxed">
          {video.discription}
        </p>
      </div>

      {/* --- Comments Section --- */}
   {/* --- Comments Section --- */}
<div className="mt-10">
  <h2 className="text-xl font-semibold mb-4 text-gray-900">
    Comments ({comments.length})
  </h2>

  {/* Input Box */}
  <div className="flex items-start gap-3 mb-6">
    <img
      src={video.owner.avatar}
      alt="user avatar"
      className="w-10 h-10 rounded-full border"
    />
    <div className="flex-1">
      <input
        type="text"
        placeholder="Add a public comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-2 text-gray-800"
      />
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={() => setContent("")}
          className="px-4 py-2 text-gray-500 hover:text-gray-700 transition"
        >
          Cancel
        </button>
        <button
          onClick={() => handleAddComment(videoId)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Comment
        </button>
      </div>
    </div>
  </div>

  {/* Comments List */}
<div className="space-y-6">
  {comments.length === 0 ? (
    <p className="text-gray-500 text-sm text-center">
      No comments yet. Be the first!
    </p>
  ) : (
    comments.map((coment) => (
      <div
        key={coment._id}
        className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
      >
        {/* Avatar */}
        <img
          src={currentuser.avatar}
          alt="commenter avatar"
          className="w-10 h-10 rounded-full border shadow-sm"
        />

        {/* Comment Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">
              {currentuser.username}
            </h3>
            <span className="text-xs text-gray-400">
              {new Date(coment.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="text-gray-700 mt-1">{coment.content}</p>

          {/* Actions */}
          <div className="flex gap-6 text-sm text-gray-500 mt-2">
            <button
              onClick={() => toggleComentLike(coment._id)}
              className="flex items-center gap-1 hover:text-blue-600 transition"
            >
              👍 <span>{coment.likesCount || 0}</span>
            </button>
{editable === coment._id ? (
  <>
    <input
      type="text"
      value={newComent}
      onChange={(e) => setnewComent(e.target.value)}
      className="border p-1 rounded"
    />
    <button
      onClick={() => handleUpdateComment(coment._id)}
      className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      Save
    </button>
  </>
) : (
  <>
    <button
      onClick={() => {
        setEditable(coment._id);
        setnewComent(coment.content || ""); 
      }}
      className="hover:text-blue-600 transition"
    >
      ✏️ Edit
    </button>
    <button
      onClick={() => handleDeleteComment(coment._id)}
      className="hover:text-red-600 transition ml-2"
    >
      🗑️ Delete
    </button>
  </>
)}

          </div>
        </div>
      </div>
    ))
  )}
</div>
</div>
</div>
   
  );
};

export default Video;  