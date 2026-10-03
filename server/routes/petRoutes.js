// Router lets us group related URLs in one file instead of piling everything into server.js.
const express = require("express");
const router = express.Router();
// Bring in the functions that do the real work.
const {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
} = require("../controllers/petController");

// Because server.js mounts this router at "/api/pets", "/" below means "/api/pets".
// Same URL, different HTTP method (GET vs POST) = different action. This style is called REST.
router.route("/").get(getPets).post(createPet);
// "/:id" is a placeholder; /api/pets/64ab... makes req.params.id = "64ab...".
router.route("/:id").get(getPetById).put(updatePet).delete(deletePet);

module.exports = router;
