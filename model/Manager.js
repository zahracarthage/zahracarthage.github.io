const mongoose = require('mongoose')
const managerSchema = new mongoose.Schema({
    username : {
        type : String, 
        require : true
    }, 
    password : {
        type : String,
        require : true
    }, 
    email: {
        type: String, 
        required : true,

    }, 
    managerAt: {
        type: String, 
        required: false, 
        
    },
    verified: {
        type: String, 
        default : false,
        
    }

})

module.exports = mongoose.model("manager", managerSchema)