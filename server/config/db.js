// "mongoose" is a helper library that lets Node.js talk to MongoDB using JavaScript objects.
const mongoose = require("mongoose");

// We wrap the connection code in a function so server.js can simply call connectDB().
// "async" means this function does slow work (network) and lets us use "await" inside it.
const connectDB = async () => {
  // try/catch = "try this; if something breaks, jump to catch instead of crashing silently".
  try {
    // "await" pauses THIS function until MongoDB answers, without freezing the whole server.
    // process.env.MONGO_URI is the database address we stored in the .env file.
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // If we reach this line, the connection worked. conn.connection.host is the DB machine name.
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // Connection failed (wrong address, MongoDB not running...). Print the reason.
    console.error("MongoDB connection failed:", error.message);
    // Stop the program with code 1 (= "exited because of an error"). No DB = no point running.
    process.exit(1);
  }
};

// Export the function so other files can "require" it.
module.exports = connectDB;
