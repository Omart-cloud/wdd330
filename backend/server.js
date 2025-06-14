// backend/server.js

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Setup multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Temporary in-memory listing data
let listings = [];

// GET listings
app.get("/api/listings", (req, res) => {
  res.json(listings);
});

// POST new listing
app.post("/api/listings", upload.array("images", 5), (req, res) => {
  const { title, location, price, description } = req.body;
  const imagePaths = req.files.map((file) => `http://localhost:${PORT}/uploads/${file.filename}`);

  const newListing = {
    id: Date.now(),
    title,
    location,
    price,
    description,
    images: imagePaths,
  };

  listings.push(newListing);
  res.status(201).json({ message: "Listing saved", listing: newListing });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
