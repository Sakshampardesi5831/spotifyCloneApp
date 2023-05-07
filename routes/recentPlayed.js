var mongoose=require("mongoose");
var recentPlayed=mongoose.Schema({
    userPlayed:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    musicPlayed:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"music"
    }
})
module.exports=mongoose.model("recent",recentPlayed);
