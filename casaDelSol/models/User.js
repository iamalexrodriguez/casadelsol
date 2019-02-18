const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PLM = require("passport-local-mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: String,
    role: {
      type: String,
      enum: ["ADMIN", "SPONSOR"],
      default: "SPONSOR"
    },
    status: {
      type: String,
      enum: ["Active", "Pending confirmation"],
      default: "Pending confirmation"
    },
    confirmationCode: {
      type: String,
      default: ""
    },
    sponsorLevel: {
      type: String,
      enum: [
        "PSICOMOTRICIDAD",
        "RECREACION",
        "SALUD",
        "NUTRICION",
        "EDUCACION",
        "HOSPEDAJE",
        "COMPLETO"
      ]
    },
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: "Child"
      }
    ]
  },
  { timestamps: true, versionKey: false }
);

userSchema.plugin(PLM, { usernameField: "email" });
const User = mongoose.model("User", userSchema);
module.exports = User;
