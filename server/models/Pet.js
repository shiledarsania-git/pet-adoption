// mongoose gives us Schema (blueprint of a record) and model (tool to read/write that record type).
const mongoose = require("mongoose");

// A SCHEMA describes what one Pet document (a "row" in SQL words) must look like.
const petSchema = new mongoose.Schema(
  {
    // name: text. "required" has an error message shown if it is missing. "trim" removes extra spaces.
    name: { type: String, required: [true, "Pet name is required"], trim: true },
    // species: only these values are allowed (dog, cat...). "enum" = allowed list.
    species: {
      type: String,
      required: [true, "Species is required"],
      enum: ["Dog", "Cat", "Rabbit", "Bird", "Other"],
    },
    // breed: e.g. "Labrador". Text.
    breed: { type: String, required: [true, "Breed is required"], trim: true },
    // age in years. "min: 0" stops negative ages.
    age: { type: Number, required: [true, "Age is required"], min: 0 },
    // gender: limited to two choices.
    gender: { type: String, enum: ["Male", "Female"], default: "Male" },
    // location: the city where the pet currently lives.
    location: { type: String, required: [true, "Location is required"], trim: true },
    // description: free text about the pet's personality. Optional, so no "required".
    description: { type: String, default: "" },
    // imageUrl: web link to a photo. Empty string if none.
    imageUrl: { type: String, default: "" },
    // status: where this pet is in the adoption journey. New pets start as "Available".
    status: {
      type: String,
      enum: ["Available", "Adopted"],
      default: "Available",
    },
  },
  // timestamps: true makes MongoDB automatically add createdAt and updatedAt dates.
  { timestamps: true }
);

// mongoose.model("Pet", schema) creates the tool we use as Pet.find(), Pet.create() etc.
// MongoDB will store these in a collection automatically named "pets".
module.exports = mongoose.model("Pet", petSchema);
