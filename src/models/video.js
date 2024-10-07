import mongoose,{Schema} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const videoSchema=new Schema({
    videoFile:{
        type:String,  //cloudinary
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    thumbnail:{
        type:String,  //cloud
        required:true
    },
    title:{
        type:String, 
        required:true
    },
    description:{
        type:String,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    duration:{
        type:Number,
        required:true
    },
    isPublished:{
        type:Boolean,
        default:true
    }

},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate) // this is to write aggregate queries 
export const video=Schema.models("video",videoSchema)