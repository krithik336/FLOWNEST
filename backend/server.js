const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Load environment variables
dotenv.config();

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

// Connect MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Home Route
app.get("/", (req, res) => {
  res.send("Project Management API Running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Handle Invalid Routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});