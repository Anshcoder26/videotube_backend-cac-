import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { Video} from "../models/video.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { mongoose } from "mongoose";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})


const publishAVideo = asyncHandler(async(req, res)=> {
    const {title, description} = req.body

    if(!(title && description)){
        throw new ApiError (400, "No title and descriptionis required")
    }

    const existedVideo = await Video.findOne({
        $or: [{title}, {description}]
    })

    if (existedVideo) {
        throw new ApiError(409, "Video with title and description already exists")
    }

    const videoFileLocalPath = req.files.videoFile[0].path;
    const thumbnailLocalPath = req.files.thumbnail[0].path;
    
    if(!videoFileLocalPath){
        throw new ApiError(400, "Video file or thumbnail is not provided")
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!videoFile && !thumbnail){
        throw new ApiError(400, "Error while uploading on cloudinary")
    }

    const newVideo = await Video.create({
        title,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        description,
        
    })

    const createdVideo = await Video.findById(newVideo._id)

    if(!createdVideo){
        throw new ApiError(500, "Something went wrong while creating the video")
    }

    return res.status(201).json(
        new ApiResponse(200, createdVideo, "Video Published successfully")
    )

})


const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(
        videoId
    )

    if(!video) {
        throw new ApiError(404, "Video not found")
    }

    const responseData = {
        title: video.title,
        description: video.description
    }

    return res
    .status(200)
    .json(new ApiResponse(200, responseData ,"Video found successfully"))
    
    
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    //TODO: update video details like title, description, thumbnail
    const {title, description} =  req.body

    if(!title || !description){
        throw new ApiError(400, "All fields are required")
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description
            }
        },
        {new: true}
    )

    if(!video){
        throw new ApiError(404, "No video which this id was found")
    }

    const responseData = {
        title: video.title,
        description: video.description
    }

    return res
    .status(200)
    .json(new ApiResponse(200, responseData, "Video details updated successfully"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    const video = await Video.findByIdAndDelete(
        videoId
    )

    if(!video){
        throw new ApiError(404, "No video which this id was found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video deleted successfully"))
    
    
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    


})

export{
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus

}