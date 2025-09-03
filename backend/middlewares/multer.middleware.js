import express from "express";
import multer from "multer";
import { publishVideo } from "../controllers/video.controler.js";

const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // folder to store temp files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Multer upload instance
export const upload = multer({ storage });

// Route to publish video
router.post(
  "/publishVideos",
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  publishVideo
);

export default router;
