const express = require("express");
const router = express.Router();
const {
  createRequest,
  getRequests,
  updateRequestStatus,
} = require("../controllers/requestController");

// POST /api/requests -> visitor submits a request. GET /api/requests -> admin lists them.
router.route("/").get(getRequests).post(createRequest);
// PATCH = change PART of a record (only the status), unlike PUT which replaces more.
router.route("/:id").patch(updateRequestStatus);

module.exports = router;
