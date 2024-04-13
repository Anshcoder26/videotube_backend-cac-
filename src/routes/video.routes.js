import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import { deleteVideo, getVideoById, publishAVideo, updateVideo } from "../controllers/video.controller.js";

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

router.route("/c/:videoId").get(getVideoById)

router.route("/updateVideo/:videoId").patch(updateVideo)

router.route("/deleteVideo/:videoId").get(deleteVideo)


export default router