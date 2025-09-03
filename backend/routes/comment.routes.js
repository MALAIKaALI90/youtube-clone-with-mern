import { Router } from "express"
const router=Router();
import { comentOnVideo ,updateComent,daleteVIdeoComent,getAllComentsVideo, getAllComment} from "../controllers/comment.controller.js";
import { verifyJwt } from "../middlewares/isLoggedIn.js"

router.route("/coment/:videoId").post(verifyJwt,comentOnVideo)
router.get("/All/:videoId", getAllComment);
router.route("/edit/:comentId").put(verifyJwt,updateComent)
router.route("/delete/:comentId").delete(verifyJwt,daleteVIdeoComent)
router.get("/user/videos",verifyJwt, getAllComentsVideo);
export default router



