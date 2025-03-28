import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url);

// Get the directory name from the file path
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());
// Serve the html from the /public directory
// Tells express to serve all files from the public folder as static assets / files
// Any requests for the css files will be resolved to the public folder
app.use(express.static(path.join(__dirname, "../public")));

// Serve static files from the 'public' directory
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Routes
app.use("/auth", authRoutes);
app.use("/todos", authMiddleware, todoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
