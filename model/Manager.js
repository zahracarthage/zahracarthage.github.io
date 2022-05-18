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
        require: true, 
    }

})

module.exports = mongoose.model("manager", managerSchema)