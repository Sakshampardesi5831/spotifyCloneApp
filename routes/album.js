var mongoose=require("mongoose");
var albumSchema=mongoose.Schema({
    albumName:String,
    albumPoster:String,
    mymusic:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"music"
    }]
})
module.exports=mongoose.model("album",albumSchema);