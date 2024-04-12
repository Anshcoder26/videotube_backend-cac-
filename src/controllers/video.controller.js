import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


/*const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})*/

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    
    if(!title || !description){
        throw new ApiError(400, "Title and description are required.");
    }
    const existedVideo = await Video.findOne({
        $or: [{title}, {description}]
    })

    if(existedVideo){
        throw new ApiError(409, "Video with title or description already exists")
    }

    const videoLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required")
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file is required")
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!videoFile){
        throw new ApiError(400, "Video file is required")
    }

    if(!thumbnail){
        throw new ApiError(400, "Thumbnail file is required")
    }

    const newVideo = await Video.create({
        title,
        video: videoFile?.url,
        thumbnail: thumbnail?.url,
        description,
    })

    const createdVideo = await Video.findById(newVideo._id);

    if(!createdVideo){
        throw new ApiError(500, "Something went wrong while publishing the video")  
    }

    return res.status(201)
          .json(new ApiResponse(201,
              {
                  ...video._doc,
                  videoFile: videoFile?.url, // Only send the URL of the video file
                  thumbnail: thumbnail?.url    // Only send the URL of the thumbnail
              },
              "Video Published Successfully"
          ))

    
    


    // TODO: get video, upload to cloudinary, create video
})

/*const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})*/

export {
    //getAllVideos,
    publishAVideo,
    //getVideoById,
    //updateVideo,
    //deleteVideo,
    //togglePublishStatus
}