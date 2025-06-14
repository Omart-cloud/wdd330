// Add at the top with other routes:
const bcrypt = require("bcrypt");

// In-memory store (replace with database later)
let users = [
  { email: "agent@example.com", password: "$2b$10$0x...", userType: "agent" }, // hashed
];

// Register route
app.post("/api/register", async (req, res) => {
  const { email, password, userType } = req.body;
  const existing = users.find(u => u.email === email);

  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { email, password: hashedPassword, userType };

  users.push(newUser);
  res.status(201).json({ user: { email, userType } });
});
