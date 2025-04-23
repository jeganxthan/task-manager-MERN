const mongoose = require('mongoose')
const TaskSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'must provide the name'],
        trim:true,
        maxlength:[20, 'Character must be in 20']
    },
    compeleted:{
        type:Boolean,
        default:false,
    }
})

module.exports= mongoose.model('Task', TaskSchema);