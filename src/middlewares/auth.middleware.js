import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req, res, next) => {
    req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")


    if(!token) {
        throw new ApiError(401, "Unauthorized request")
    }

    jwt.verify()

})