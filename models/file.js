const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const FiledSchema = new Schema({
    folderKey: {
        type: String,
        require: true
    },
    files:{
        type: Array,
        items:{
                 type: String
                },
        require: true
    },
    userId: {
        type: String,
        required: true
      },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
                        // mongoose.model('ModelName', mySchema)

module.exports = User = mongoose.model('files',FiledSchema,'files');
