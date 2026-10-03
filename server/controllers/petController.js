// Controllers hold the real LOGIC: "what should happen when this URL is called?"
// We need both models because deleting a pet must also clean up its requests.
const Pet = require("../models/Pet");
const AdoptionRequest = require("../models/AdoptionRequest");

// Helper: makes user text safe to use inside a search pattern (so "." or "*" are treated as plain letters).
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ---------- READ ALL PETS (GET /api/pets) ----------
// req = the incoming request (what the browser sent). res = our reply.
const getPets = async (req, res) => {
  try {
    // "filter" starts empty = "match every pet". We add conditions only if the user asked for them.
    const filter = {};
    // Example URL: /api/pets?species=Dog  -> req.query.species is "Dog".
    if (req.query.species) filter.species = req.query.species;
    if (req.query.status) filter.status = req.query.status;
    // "i" flag = case-insensitive, so "pune" matches "Pune". We search for partial matches.
    if (req.query.location) filter.location = new RegExp(escapeRegex(req.query.location), "i");
    if (req.query.breed) filter.breed = new RegExp(escapeRegex(req.query.breed), "i");

    // Pet.find(filter) asks MongoDB for all matching pets. sort({createdAt:-1}) = newest first.
    const pets = await Pet.find(filter).sort({ createdAt: -1 });
    // Send the list back as JSON. Status 200 = OK (this is the default, written for clarity).
    res.status(200).json(pets);
  } catch (error) {
    // 500 = "something broke on the server".
    res.status(500).json({ message: error.message });
  }
};

// ---------- READ ONE PET (GET /api/pets/:id) ----------
const getPetById = async (req, res) => {
  try {
    // ":id" in the route becomes req.params.id. findById fetches exactly one document.
    const pet = await Pet.findById(req.params.id);
    // If nothing was found, tell the client with 404 (= "not found").
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.status(200).json(pet);
  } catch (error) {
    // A malformed id (e.g. "abc") also lands here.
    res.status(400).json({ message: "Invalid pet id" });
  }
};

// ---------- CREATE PET (POST /api/pets) ----------
const createPet = async (req, res) => {
  try {
    // req.body = the JSON the client sent (thanks to express.json() in server.js).
    // Pet.create validates against the schema, then saves to MongoDB.
    const pet = await Pet.create(req.body);
    // 201 = "Created" (a new record now exists).
    res.status(201).json(pet);
  } catch (error) {
    // 400 = "bad request" - usually validation failed (missing name, negative age...).
    res.status(400).json({ message: error.message });
  }
};

// ---------- UPDATE PET (PUT /api/pets/:id) ----------
const updatePet = async (req, res) => {
  try {
    // {new:true} returns the updated document; {runValidators:true} re-checks schema rules on update.
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.status(200).json(pet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ---------- DELETE PET (DELETE /api/pets/:id) ----------
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    // Remove requests that pointed to this pet, otherwise they would be "orphans" pointing to nothing.
    await AdoptionRequest.deleteMany({ pet: pet._id });
    res.status(200).json({ message: "Pet deleted" });
  } catch (error) {
    res.status(400).json({ message: "Invalid pet id" });
  }
};

// Export all five functions so the routes file can attach them to URLs.
module.exports = { getPets, getPetById, createPet, updatePet, deletePet };
