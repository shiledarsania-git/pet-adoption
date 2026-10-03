// useState lets a component remember values that change (like typed text).
import { useState } from "react";
import { submitRequest } from "../api.js";

// petId comes from the parent page so we know WHICH pet the request is for.
export default function AdoptionForm({ petId }) {
  // form = an object holding what the user has typed. setForm updates it and re-draws the screen.
  const [form, setForm] = useState({ applicantName: "", email: "", phone: "", message: "" });
  // Feedback for the user after submitting.
  const [status, setStatus] = useState({ type: "", text: "" });

  // Runs whenever the user types in any input.
  const handleChange = (e) => {
    // e.target.name is the input's name attribute; e.target.value is the new text.
    // [e.target.name] is a "computed key": update only the field being typed in.
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Runs when the form is submitted.
  const handleSubmit = async (e) => {
    // Stop the browser's default behaviour of reloading the page on submit.
    e.preventDefault();
    try {
      // Send form data plus the pet id to the backend and wait for its reply.
      await submitRequest({ ...form, pet: petId });
      setStatus({ type: "ok", text: "Request sent! The shelter will contact you by email." });
      // Clear the inputs.
      setForm({ applicantName: "", email: "", phone: "", message: "" });
    } catch (err) {
      // Show the backend's error message (e.g. invalid email).
      setStatus({ type: "error", text: err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h3>Request to adopt</h3>
      {/* "value" + "onChange" together make a CONTROLLED input: React owns the text. */}
      <input name="applicantName" placeholder="Your full name" value={form.applicantName} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="phone" placeholder="Phone (optional)" value={form.phone} onChange={handleChange} />
      <textarea name="message" rows="3" placeholder="Tell us why you would be a great home" value={form.message} onChange={handleChange} />
      <button type="submit">Send adoption request</button>
      {/* Only draw the message when there is one */}
      {status.text && <p className={status.type}>{status.text}</p>}
    </form>
  );
}
