import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { Video} from "../models/video.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { mongoose } from "mongoose";

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

export{
    publishAVideo
}