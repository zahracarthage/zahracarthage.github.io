const mongoose = require('mongoose')
const usersSchema =  new mongoose.Schema({
      username :{
        type: String,
        required: true
      } ,
      password : {
        type: String,
        required: true
      } ,
      picture: {
        type: String,
        required: false,
        default : "No Picture"
      },
      email: {
        type: String,
        required: false,
        default : "No Email"
      },
      followers: [{
        type: mongoose.Types.ObjectId,
        default: []
      }],
      following: [{
        type: mongoose.Types.ObjectId,
        default: []
      }],
      posts : [{
        type: mongoose.Types.ObjectId,
        ref : "Posts",
        default: []
      }],
      
  
      
    })


module.exports = mongoose.model("users", usersSchema)