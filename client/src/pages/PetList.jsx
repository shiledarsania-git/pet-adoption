// useEffect runs code at chosen moments (e.g. when the page loads or a filter changes).
import { useEffect, useState } from "react";
import { fetchPets } from "../api.js";
import PetCard from "../components/PetCard.jsx";

export default function PetList() {
  // pets: the list from the server. Starts empty.
  const [pets, setPets] = useState([]);
  // filters typed/selected by the visitor.
  const [filters, setFilters] = useState({ species: "", breed: "", location: "" });
  // loading/error give the user feedback while waiting.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Runs once at first display AND again every time "filters" changes (see [filters] at the end).
  useEffect(() => {
    setLoading(true);
    // Ask the backend for pets matching the filters.
    fetchPets(filters)
      .then((data) => { setPets(data); setError(""); })   // success: store the pets
      .catch((err) => setError(err.message))               // failure: store the message
      .finally(() => setLoading(false));                   // either way: stop the spinner
  }, [filters]);

  // Update one filter while keeping the others.
  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  return (
    <>
      <h1>Pets looking for a home</h1>
      <div className="filters">
        <select name="species" value={filters.species} onChange={handleChange}>
          <option value="">All species</option>
          <option>Dog</option><option>Cat</option><option>Rabbit</option><option>Bird</option><option>Other</option>
        </select>
        <input name="breed" placeholder="Breed" value={filters.breed} onChange={handleChange} />
        <input name="location" placeholder="City" value={filters.location} onChange={handleChange} />
      </div>

      {/* Conditional rendering: show only ONE of these depending on the situation */}
      {loading && <p>Loading pets...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && pets.length === 0 && <p>No pets match your search. Try clearing a filter.</p>}

      <div className="grid">
        {/* map() turns each pet object into a card. "key" helps React track each item. */}
        {pets.map((pet) => <PetCard key={pet._id} pet={pet} />)}
      </div>
    </>
  );
}
