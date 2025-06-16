const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

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
let users = loadData("users.json");

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

// --- USER AUTHENTICATION ROUTES ---

app.post("/api/register", async (req, res) => {
  const { email, password, userType } = req.body;

  if (!email || !password || !userType) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: Date.now(),
      email,
      password: hashedPassword,
      userType,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveData("users.json", users);

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error during registration" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  try {
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error during login" });
  }
});

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
