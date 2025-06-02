import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
// import { loginUser, logoutUser, registerUser } from "../controllers/user.controler.js"
import { verifyJwt } from "../middlewares/isLoggedIn.js"
import { registerUser,loginUser,logoutUser,currentUser,userNewPassword,updateUserDetail} from "../controllers/user.controler.js"
const router = Router()
router.route("/register").post(upload.fields([{ name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]),
    registerUser)
router.route("/login").post(loginUser)


//secure route

router.route("/logout").post( verifyJwt,logoutUser)
router.route("/newpassword").post( verifyJwt,userNewPassword)
router.route("/currentuser").post( verifyJwt,currentUser)
router.route("/C:username").post( verifyJwt,updateUserDetail)

//export default than emport man chahi naam

export default router
