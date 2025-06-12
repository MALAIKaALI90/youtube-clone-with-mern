import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
// import { loginUser, logoutUser, registerUser } from "../controllers/user.controler.js"
import { verifyJwt } from "../middlewares/isLoggedIn.js"
import { registerUser,loginUser,logoutUser,currentUser,userNewPassword,updateUserDetail,getUserProfileSubscribtion ,UpdateAvatarFile ,UpdateCoverFile,getUserWatchHistory} from "../controllers/user.controler.js"
const router = Router()
router.route("/register").post(upload.fields([{
     name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]),
    registerUser)
router.route("/login").post(loginUser)


//secure route

router.route("/logout").post( verifyJwt,logoutUser)
router.route("/newpassword").post( verifyJwt,userNewPassword)
router.route("/currentuser").post( verifyJwt,currentUser)
router.route("/C:username").post( verifyJwt,updateUserDetail)

router.route("/avatar").patch( verifyJwt,upload.single("avatar"), UpdateAvatarFile )
router.route("/coverImage").patch( verifyJwt, upload.single("coverImage"),UpdateCoverFile)
router.route("/c/:username").get( verifyJwt,getUserProfileSubscribtion )
router.route("/history").get( verifyJwt,getUserWatchHistory)
//export default than emport man chahi naam

export default router
