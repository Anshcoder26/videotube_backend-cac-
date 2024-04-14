import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"

const router = Router();

router.route("/addComment/:videoId").post(addComment);
router.route("/:videoId").get(getVideoComments);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router