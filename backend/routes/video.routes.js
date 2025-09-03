import express from "express"
const app=express()
import { Router } from "express"
const router=Router()
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/isLoggedIn.js"
import { publishVideo,getVideoById,updateVideo,videoDelete, updateFile, getAllVideos,incrementViews, getMyVideos} from "../controllers/video.controler.js";

app.use(verifyJwt)
router.route("/publishVideos").post(verifyJwt,upload.fields([{
     name: "videoFile", maxCount: 1 }, { name: "thumbnail", maxCount: 1 },])
 ,publishVideo )
 router.route("/getAllVideos").get( getAllVideos);
 router.route("/getmyvideos").get( verifyJwt,getMyVideos)

   router.route("/views/:videoId").post(incrementViews)
   router.route("/update/:videoId").patch(updateVideo)

   router.route("/:videoId").get(getVideoById)
router.route("/getmyvideos").get(getMyVideos)
   router.route("/updateFile/:videoId").put( upload.single("thumbnail"),updateFile)
   router.route("/delete/:videoId").delete(videoDelete)
   

export default router