require("dotenv").config({ path: "sample.env" });
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("dns");
const bodyParser = require("body-parser");
const validUrl = require("valid-url");
const mongoose = require("mongoose");
let urlSchema = require("./urlModel");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});





// API endpoints

app.get("/api/shorturl/:short_url?", async (req, res) => {
  await urlSchema.findOne({ shortUrl: req.params.short_url }).then((response) => {
    if (response) {

      res.redirect(response.longUrl);
    } else {
      res.json({ error: "shortcut not found" + response });
    }
  });
});



//Check input Middleware
const dnsMiddleware = (req, res, next) => {
  const longUrl = req.body.url;

  if (!validUrl.isUri(longUrl)) {
    return res.status(400).send({ error1: "invalid url" });
  }
  const hostname = new URL(longUrl).hostname;
  console.log(hostname)
  dns.lookup(hostname, (err) => {
    if (err) {
      return res.status(400).send({ error2: "invalid url" });
    }
    req.longUrl = longUrl;
    next();
  });
};

app.post("/api/shorturl", dnsMiddleware, async (req, res) => {
  const longUrl = req.longUrl;

  // Check if the URL has already been shortened

  const existingUrl = await urlSchema.findOne({ longUrl });
  if (existingUrl) {
    return res.json({ original_url: longUrl, short_url: existingUrl.shortUrl });
  }

  // If not, count the number of existing URLs
  const count = await urlSchema.countDocuments();
  const newshortUrl = count + 1;
  // Create a new URL entry with the next short code
  const newRecord = new urlSchema({ longUrl, shortUrl: newshortUrl });
  await newRecord.save();

  return res.json({ original_url: longUrl, short_url: newshortUrl });
});

// Connect to MongoDB
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.error(err));
const db = mongoose.connection;

// Check connection status
// 0 = disconnected
// 1 = connected
// 2 = connecting
// 3 = disconnecting
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log(`MongoDB connection readyState: ${db.readyState}`);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
