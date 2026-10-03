// Import mongoose to define the blueprint.
const mongoose = require("mongoose");

// Blueprint for one adoption request (a person saying "I want this pet").
const requestSchema = new mongoose.Schema(
  {
    // pet: stores the _id of a Pet document. This is a RELATION (like a foreign key in SQL).
    // "ref: 'Pet'" tells mongoose which collection that id points to, so we can later "populate" it.
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    // Who is asking?
    applicantName: { type: String, required: [true, "Your name is required"], trim: true },
    // Email so the shelter can reply. "lowercase" normalises input; "match" checks a simple email pattern.
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    // Phone number, optional.
    phone: { type: String, trim: true, default: "" },
    // Short message: why they want to adopt.
    message: { type: String, default: "" },
    // status: Pending (new) -> Approved or Rejected (decided by an admin).
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  // Automatic createdAt / updatedAt again.
  { timestamps: true }
);

// Create and export the model. Collection name becomes "adoptionrequests".
module.exports = mongoose.model("AdoptionRequest", requestSchema);
