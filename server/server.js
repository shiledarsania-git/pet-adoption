// Read the .env file first, so process.env.PORT and process.env.MONGO_URI are available below.
require("dotenv").config();
// Express: the framework that turns "URL + method" into function calls.
const express = require("express");
// CORS: browsers block a site on port 5173 from calling a server on port 5000 unless the server allows it.
const cors = require("cors");
// Our database connection function.
const connectDB = require("./config/db");
// Our two groups of URLs.
const petRoutes = require("./routes/petRoutes");
const requestRoutes = require("./routes/requestRoutes");

// Create the application object. Everything else is attached to it.
const app = express();

// Open the database connection as the server starts.
connectDB();

// MIDDLEWARE = code that runs on EVERY request before it reaches our routes (like airport security).
// 1) Allow cross-origin calls from the React app.
app.use(cors());
// 2) Read JSON sent by the browser and place it in req.body.
app.use(express.json());

// A tiny test route: visiting http://localhost:5000/ proves the server is alive.
app.get("/", (req, res) => res.send("Pet Adoption API is running"));

// Mount routers: any URL starting with /api/pets goes to petRoutes, etc.
app.use("/api/pets", petRoutes);
app.use("/api/requests", requestRoutes);

// If no route matched above, answer with a clean 404 in JSON instead of an HTML error page.
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Use the port from .env, or 5000 if none is set.
const PORT = process.env.PORT || 5000;
// Start listening for requests. The callback runs once the server is ready.
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
