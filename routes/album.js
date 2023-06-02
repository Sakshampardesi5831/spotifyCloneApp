var mongoose=require("mongoose");
var albumSchema=mongoose.Schema({
    albumName:String,
    albumPoster:String,
    albumCategory:String,
    mymusic:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"music"
    }],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
    follow:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }]
},{timestamps:true})
module.exports=mongoose.model("album",albumSchema);