import mongoose from "mongoose";

const TagSchema = mongoose.Schema({
    tagname:{
        type:String,
        required: true
    },
    desc:{
        type:String,
        required:true
    }
})
export default mongoose.model('tag', TagSchema);
