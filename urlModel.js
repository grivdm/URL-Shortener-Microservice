let mongoose = require("mongoose");

let urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortUrl: { type: Number, required: true },
});

module.exports = mongoose.model("urlSchema", urlSchema);
