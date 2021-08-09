const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema({
  content: { type: String, max: 140 },
  date: Date,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  likes: Number,
  //Pasar quien da like para acá
  // likes: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "User",
  //   },
  // ],
});

const Tweet = mongoose.model("Tweet", userSchema);

module.exports = Tweet;
