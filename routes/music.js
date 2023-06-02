const mongoose=require("mongoose");

var musicSchema=mongoose.Schema({
    songName:String,
    songAlbum:String,
    songArtist:String,
    songPosterFile:{
        type:Array,
        default:[]
    },
    songLiked:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }], 
    albumName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"album"
    }
},{timestamps:true})
module.exports=mongoose.model("music",musicSchema);