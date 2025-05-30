import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { loginUser, logoutUser, registerUser } from "../controllers/user.controler.js"
import { verifyJwt } from "../middlewares/isLoggedIn.js"
const router = Router()
router.route("/register").post(upload.fields([{ name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]),
    registerUser)
router.route("/login").post(loginUser)


//secure route

router.route("/logout").post( verifyJwt,logoutUser)
//export default than emport man chahi naam
export default router
