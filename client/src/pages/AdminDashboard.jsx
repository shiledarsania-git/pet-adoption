import { useEffect, useState } from "react";
import { fetchPets, createPet, deletePet, fetchRequests, setRequestStatus } from "../api.js";

// Starting (empty) values of the "add pet" form. Kept outside so we can reuse it to reset the form.
const emptyPet = { name: "", species: "Dog", breed: "", age: "", gender: "Male", location: "", description: "", imageUrl: "" };

export default function AdminDashboard() {
  const [pets, setPets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [newPet, setNewPet] = useState(emptyPet);
  const [error, setError] = useState("");

  // Load pets and requests together from the backend. Reused after every change.
  const loadAll = async () => {
    try {
      // Promise.all waits for both calls at the same time (faster than one after another).
      const [petData, requestData] = await Promise.all([fetchPets(), fetchRequests()]);
      setPets(petData);
      setRequests(requestData);
    } catch (err) {
      setError(err.message);
    }
  };

  // Run loadAll once when the page opens. Empty [] = "only once".
  useEffect(() => { loadAll(); }, []);

  const handleChange = (e) => setNewPet({ ...newPet, [e.target.name]: e.target.value });

  // Add a new pet record.
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createPet(newPet);
      setNewPet(emptyPet);  // clear the form
      setError("");
      loadAll();            // refresh lists so the new pet appears
    } catch (err) { setError(err.message); }
  };

  // Delete a pet (after asking "are you sure?").
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this pet and its requests?")) return;
    try { await deletePet(id); loadAll(); } catch (err) { setError(err.message); }
  };

  // Approve or reject a request.
  const handleStatus = async (id, status) => {
    try { await setRequestStatus(id, status); setError(""); loadAll(); }
    catch (err) { setError(err.message); }
  };

  return (
    <>
      <h1>Shelter admin</h1>
      {error && <p className="error">{error}</p>}

      <h2>Add a pet</h2>
      <form onSubmit={handleAdd} className="form inline">
        <input name="name" placeholder="Name" value={newPet.name} onChange={handleChange} required />
        <select name="species" value={newPet.species} onChange={handleChange}>
          <option>Dog</option><option>Cat</option><option>Rabbit</option><option>Bird</option><option>Other</option>
        </select>
        <input name="breed" placeholder="Breed" value={newPet.breed} onChange={handleChange} required />
        <input name="age" type="number" min="0" step="0.5" placeholder="Age (years)" value={newPet.age} onChange={handleChange} required />
        <select name="gender" value={newPet.gender} onChange={handleChange}>
          <option>Male</option><option>Female</option>
        </select>
        <input name="location" placeholder="City" value={newPet.location} onChange={handleChange} required />
        <input name="imageUrl" placeholder="Photo link (optional)" value={newPet.imageUrl} onChange={handleChange} />
        <input name="description" placeholder="Short description" value={newPet.description} onChange={handleChange} />
        <button type="submit">Add pet</button>
      </form>

      <h2>Adoption requests</h2>
      {requests.length === 0 && <p className="muted">No requests yet.</p>}
      <div className="table">
        {requests.map((r) => (
          <div className="row" key={r._id}>
            <div>
              {/* r.pet can be null if the pet was deleted, so we use ?. (optional chaining) to avoid a crash */}
              <strong>{r.applicantName}</strong> wants <strong>{r.pet?.name || "a removed pet"}</strong>
              <div className="muted">{r.email} {r.phone && `| ${r.phone}`}</div>
              {r.message && <div>{r.message}</div>}
            </div>
            <div className="actions">
              <span className={`badge ${r.status.toLowerCase()}`}>{r.status}</span>
              {/* Buttons appear only for requests still waiting for a decision */}
              {r.status === "Pending" && (
                <>
                  <button onClick={() => handleStatus(r._id, "Approved")}>Approve</button>
                  <button className="secondary" onClick={() => handleStatus(r._id, "Rejected")}>Reject</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <h2>All pets</h2>
      <div className="table">
        {pets.map((p) => (
          <div className="row" key={p._id}>
            <div><strong>{p.name}</strong> - {p.breed}, {p.age} yrs, {p.location}</div>
            <div className="actions">
              <span className={`badge ${p.status.toLowerCase()}`}>{p.status}</span>
              <button className="secondary" onClick={() => handleDelete(p._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
