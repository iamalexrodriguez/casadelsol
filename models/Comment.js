const mongoose = require('mongoose')
const Schema = mongoose.Schema

let commentSchema = new Schema({
  comment: String,
  child:{
    type: Schema.Types.ObjectId,
    ref:'User'
  },
  body: String,
  photoURL: String,
},
{timestamps:true,
versionKey:false}
)




module.exports = mongoose.model('Comment', commentSchema)