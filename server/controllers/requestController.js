// Models we read/write in this controller.
const AdoptionRequest = require("../models/AdoptionRequest");
const Pet = require("../models/Pet");

// ---------- SUBMIT A REQUEST (POST /api/requests) ----------
const createRequest = async (req, res) => {
  try {
    // Pull the fields we expect out of the body (ignore anything unexpected such as a fake "status").
    const { pet: petId, applicantName, email, phone, message } = req.body;

    // Business rule 1: the pet must exist.
    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    // Business rule 2: adopted pets cannot receive new requests. 400 = client asked for something invalid.
    if (pet.status === "Adopted") {
      return res.status(400).json({ message: "This pet has already been adopted" });
    }

    // Save the request. Its status defaults to "Pending" because of the schema.
    const request = await AdoptionRequest.create({
      pet: petId,
      applicantName,
      email,
      phone,
      message,
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ---------- LIST ALL REQUESTS (GET /api/requests) - used by the admin page ----------
const getRequests = async (req, res) => {
  try {
    // populate("pet") swaps the stored pet id for the full pet document (name, breed...).
    // It is like a SQL JOIN. Without it we would only see an unreadable id.
    const requests = await AdoptionRequest.find()
      .populate("pet")
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- CHANGE STATUS (PATCH /api/requests/:id) ----------
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    // Only accept known statuses.
    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await AdoptionRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    // Special logic when the admin approves a request.
    if (status === "Approved") {
      const pet = await Pet.findById(request.pet);
      // The pet may have been deleted or already adopted through another request.
      if (!pet) return res.status(404).json({ message: "Pet no longer exists" });
      if (pet.status === "Adopted") {
        return res.status(400).json({ message: "Pet already adopted" });
      }
      // The pet is now taken.
      pet.status = "Adopted";
      await pet.save();
      // Everyone else waiting for the same pet is automatically rejected.
      // $ne = "not equal": all requests for this pet EXCEPT the approved one, that are still Pending.
      await AdoptionRequest.updateMany(
        { pet: pet._id, _id: { $ne: request._id }, status: "Pending" },
        { status: "Rejected" }
      );
    }

    // Save the new status on this request.
    request.status = status;
    await request.save();
    // Send it back with pet details filled in so the UI can refresh easily.
    await request.populate("pet");
    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createRequest, getRequests, updateRequestStatus };
