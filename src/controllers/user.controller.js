import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser= asyncHandler( async (req, res)=> {
    res.status(200).json({
        message:"ansh is the best backend developer ever seen in this fucking world!!!"
    })
})


export {registerUser}