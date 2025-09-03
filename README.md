🎬 YouTube Clone (MERN Stack)

A full-stack YouTube clone built with the MERN stack (MongoDB, Express.js, React, Node.js).
This project replicates core YouTube features like uploading, watching, liking, commenting, and managing videos.

🚀 Features

✅ User Authentication (Register/Login with JWT)
✅ Upload and Stream Videos
✅ Like / Unlike Videos
✅ Comment System
✅ Watch History
✅ Subscriptions (Follow/Unfollow channels)
✅ Responsive UI with modern design

🛠 Tech Stack

Frontend

⚛️ React.js

🎨 Tailwind CSS

Backend

🌐 Node.js + Express.js

🛢 MongoDB + Mongoose

🔐 JWT Authentication

Others

☁️ Cloudinary for video/image storage

⚡ Axios for API calls

📂 Project Structure
youtube-clone-mern/
│
├── backend/        # Express server, APIs, database models
├── frontend/       # React app (UI)
├── .gitignore
├── README.md
└── package.json

⚡ Installation & Setup

Clone the repository

git clone https://github.com/MALAIKaALI90/youtube-clone-with-mern.git
cd youtube-clone-mern


Backend setup

cd backend
npm install
npm start


Frontend setup

cd frontend
npm install
npm run dev


Environment Variables
Create a .env file in backend/ with:

MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
