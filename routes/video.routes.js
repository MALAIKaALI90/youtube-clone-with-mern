import express from "express"
const app=express()
import { Router } from "express"
const router=Router()
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/isLoggedIn.js"
import { publishVideo,getVideoById,updateVideo,videoDelete, updateFile, getAllVideos,incrementViews} from "../controllers/video.controler.js";

app.use(verifyJwt)
router.route("/publishVideos").post(upload.fields([{
     name: "videoFile", maxCount: 1 }, { name: "thumbnail", maxCount: 1 },])
 ,publishVideo )
   router.route("/:videoId").post(updateVideo)
   router.route("/:videoId").get(incrementViews)
   router.route("/:videoId").put( upload.single("thumbnail"),updateFile)
   router.route("/:videoId").delete(videoDelete)
   router.route("/:all").get(getAllVideos)
export default router