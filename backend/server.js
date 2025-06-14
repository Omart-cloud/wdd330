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

// Utility functions to load/save JSON
const loadData = (file) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, file));
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const saveData = (file, data) => {
  fs.writeFileSync(path.join(__dirname, file), JSON.stringify(data, null, 2));
};

// Load existing data
let listings = loadData("listings.json");
let chatMessages = loadData("chat.json");

// Multer setup for image + document uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads";
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// --- LISTING ROUTES ---

app.get("/api/listings", (req, res) => {
  res.json(listings);
});

app.post("/api/listings", upload.fields([
  { name: "images", maxCount: 5 },
  { name: "documents", maxCount: 3 }
]), (req, res) => {
  const { title, location, price, description, latitude, longitude } = req.body;

  if (!title || !location || !price || !latitude || !longitude) {
    return res.status(400).json({ message: "Missing required listing data." });
  }

  const imagePaths = (req.files["images"] || []).map(file =>
    `http://localhost:${PORT}/uploads/${file.filename}`
  );
  const documentPaths = (req.files["documents"] || []).map(file =>
    `http://localhost:${PORT}/uploads/${file.filename}`
  );

  const newListing = {
    id: Date.now(),
    title,
    location,
    price: parseFloat(price),
    description,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    images: imagePaths,
    documents: documentPaths,
  };

  listings.push(newListing);
  saveData("listings.json", listings);

  res.status(201).json({ message: "Listing saved", listing: newListing });
});

// --- CHAT ROUTES ---

app.get("/api/chat", (req, res) => {
  res.json(chatMessages);
});

app.post("/api/chat", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Message text is required." });
  }

  const message = {
    text,
    timestamp: new Date().toISOString()
  };

  chatMessages.push(message);
  saveData("chat.json", chatMessages);

  res.status(201).json(message);
});

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
