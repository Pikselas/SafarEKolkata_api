const mongoose=require("mongoose")

const placeSchema=new mongoose.Schema({
    

    place_name:String,
    image_src:String,
    description:String,
    rating:String,
    place_id:String

})

module.exports=mongoose.model("PlaceData",placeSchema)