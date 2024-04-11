import mongoose, {Schema} from "mongoose";

const playlistSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    description: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    videos: [{
        type: Schema.Types.ObjectId,
        ref: "Video" 
    }],

},{
    timestamps: true
})

export const Playlist = mongoose.model("Playlist", playlistSchema)