 import express from "express"
 const  app=express()
 import { Router } from "express"
import { verifyJwt } from "../middlewares/isLoggedIn.js"
import { toggleVideoLike,getAllLikedVideos } from "../controllers/like.controller.js"
const router = Router()
app.use(verifyJwt)
router.route("/:videoId").post(verifyJwt,toggleVideoLike)

router.route("/:comentId").get(verifyJwt,toggleVideoLike)

router.route("/allVideos").get(verifyJwt,getAllLikedVideos)
export default router