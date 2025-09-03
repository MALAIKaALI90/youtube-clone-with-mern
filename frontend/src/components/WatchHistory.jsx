import React, { useEffect, useState } from "react";
import axios from "axios";

const WatchHistory = () => {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("AccessToken"); // from login
      const res = await axios.get("http://localhost:3000/api/v1/users/history", {
        headers: { Authorization: `Bearer ${token}` }
      });
console.log(res.data.message);

      setHistory(res.data.data); 
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

 return (
  <div>
    {Array.isArray(history) && history.length > 0 ? (
      <div className="grid grid-cols-3 gap-4">
        {history.map((video) => (
          <div key={video._id} className="border rounded-lg p-2 shadow">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="text-lg font-semibold mt-2">{video.title}</h3>
            <div className="flex items-center mt-2">
              <img
                src={video.owner?.avatar}
                alt={video.owner?.fullname}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span>{video.owner?.username}</span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p>No videos watched yet</p>
    )}
  </div>
);

};

export default WatchHistory;

