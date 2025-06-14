import { Router } from "express"
const router=Router();
import { comentOnVideo ,updateComent,daleteVIdeoComent,getAllComentsVideo} from "../controllers/comment.controller.js";
import { verifyJwt } from "../middlewares/isLoggedIn.js"

router.route("/:videoId").post(verifyJwt,comentOnVideo)
router.route("/:comentId").get(verifyJwt,updateComent)
router.route("/:comentId").delete(verifyJwt,daleteVIdeoComent)
router.route("/:comentId/allcoment").get(verifyJwt,getAllComentsVideo)


export default router


