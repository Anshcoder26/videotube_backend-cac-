import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Extract content from request body
    const { content } = req.body;

    // Check if content exists
    if (!content) {
        return res.status(400).json({ error: "No content for comment provided" });
    }

    try {
        // Find the video by ID
        const video = await Video.findById(videoId);

        // Check if video exists
        if (!video) {
            return res.status(404).json({ error: "No video found with this ID" });
        }

        // Create the comment
        const comment = new Comment({
            content,
            video: video._id, // Associate the comment with the video
        });

        // Save the comment
        await comment.save();

        // Prepare response data
        const responseData = {
            commentId: comment._id,
            title: video.title,
            content: comment.content, // Accessing the content of the saved comment
        };

        // Send success response
        return res
        .status(200)
        .json(new ApiResponse(200, responseData, "Comment published successfully"));
    } catch (error) {
        console.error("Error adding comment:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


const updateComment = asyncHandler(async (req, res) => {
    const{commentId} = req.params
    
    const {content} = req.body

    if(!content){
        throw new ApiError(400, "All fields are required")
    }

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{
                content
            }
        },
        {new: true}
    )

    if(!comment){
        throw new ApiError(404, "No comment which this id was found")
    }

    const responseData = {
        commentId: comment._id,
        content: comment.content
    }
    // TODO: update a comment

    return res
        .status(200)
        .json(new ApiResponse(200, responseData, "Comment Updated successfully"));


})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId} = req.params

    const comment = await Comment.findByIdAndDelete(
        commentId
    )

    if(!comment){
        throw new ApiError(500, "No comment was found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }