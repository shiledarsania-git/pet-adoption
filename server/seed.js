// Run with "npm run seed". It fills the database with sample pets so the site is not empty.
require("dotenv").config();
const mongoose = require("mongoose");
const Pet = require("./models/Pet");
const AdoptionRequest = require("./models/AdoptionRequest");

// A list of plain JavaScript objects; each becomes one Pet document.
const pets = [
  { name: "Bruno", species: "Dog", breed: "Labrador Retriever", age: 3, gender: "Male", location: "Nagpur", description: "Friendly, loves fetch and children.", imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600" },
  { name: "Mishti", species: "Cat", breed: "Persian", age: 2, gender: "Female", location: "Pune", description: "Calm lap cat who enjoys quiet evenings.", imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600" },
  { name: "Coco", species: "Rabbit", breed: "Holland Lop", age: 1, gender: "Female", location: "Mumbai", description: "Curious, gentle, litter trained.", imageUrl: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600" },
  { name: "Rocky", species: "Dog", breed: "Indian Pariah", age: 4, gender: "Male", location: "Nagpur", description: "Loyal, healthy and great with other dogs.", imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600" },
];

const run = async () => {
  // Connect, wipe old sample data, insert fresh data, disconnect.
  await mongoose.connect(process.env.MONGO_URI);
  await AdoptionRequest.deleteMany();
  await Pet.deleteMany();
  await Pet.insertMany(pets);
  console.log("Sample pets inserted");
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
