 import express from "express"
 const  app=express()
 import { Router } from "express"
import { verifyJwt } from "../middlewares/isLoggedIn.js"
import { toggleVideoLike,getAllLikedVideos, toggleComentLike } from "../controllers/like.controller.js"
const router = Router()
app.use(verifyJwt)
router.route("/like/:videoId").get(verifyJwt,toggleVideoLike)

router.route("/like/:comentId").post(verifyJwt,toggleComentLike)

router.route("/allVideos").get(verifyJwt,getAllLikedVideos)
export default router