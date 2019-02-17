const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let childSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  profilePic: String,
  pictureGallery: [],
  bio: String,
  comments: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
},{
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model('Child', childSchema)

