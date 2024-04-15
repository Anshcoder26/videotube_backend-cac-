import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
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
        const tweet = new Tweet({
            content,
            video: video._id, // Associate the tweet with the video
        });

        // Save the comment
        await tweet.save();

        // Prepare response data
        const responseData = {
            tweetId: tweet._id,
            title: video.title,
            tweet: tweet.content, // Accessing the content of the saved comment
        };

        // Send success response
        return res
        .status(200)
        .json(new ApiResponse(200, responseData, "Comment published successfully"));
    } catch (error) {
        console.error("Error adding comment:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }


})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params

    const {content} = req.body

    if(!content){
        throw new ApiError(400, "Content Field is required")
    }

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content
            }
        },
        {new: true}
    )

    if(!tweet){
        throw new ApiError(404, "404 Not Found")
    }

    const responseData = {
        tweetId: tweet._id,
        content: tweet.content
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, responseData, "Tweet was updated successfully")
    )
    
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params

    const tweet = await Tweet.findByIdAndDelete(
        tweetId
    )

    if(!tweet){
        throw new ApiError(400, "Tweet with this Id was not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}