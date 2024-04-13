import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import { publishAVideo } from "../controllers/video.controller.js";

const router = Router()

router.route("/publish-video").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]), publishAVideo
)

export default router