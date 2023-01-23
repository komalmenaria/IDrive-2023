const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const folderSchema = new Schema({

  folderName: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  mongoFolderKey: {
    type: String,
    required: true
  },
  FilesName: {
    type: Array,
    items: {
      type: String
    },
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

})


module.exports = Otp = mongoose.model('folders', folderSchema, `folders`);
