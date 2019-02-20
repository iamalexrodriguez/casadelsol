const mongoose = require('mongoose')
const Schema = mongoose.Schema

let postSchema = new Schema({
  description: String,
  photoURL: String,
  child:{
    type: Schema.Types.ObjectId,
    ref:'Child'
  }
},{
  timestamps: true,
  versionKey: false
})

module.exports = mongoose.model('Post', postSchema)