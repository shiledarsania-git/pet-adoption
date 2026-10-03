import { useEffect, useState } from "react";
// useParams reads the ":id" part of the URL (/pets/:id).
import { useParams, Link } from "react-router-dom";
import { fetchPet } from "../api.js";
import AdoptionForm from "../components/AdoptionForm.jsx";

export default function PetDetail() {
  const { id } = useParams();          // the pet id from the address bar
  const [pet, setPet] = useState(null); // null = "not loaded yet"
  const [error, setError] = useState("");

  // Load this one pet when the page opens (or when id changes).
  useEffect(() => {
    fetchPet(id).then(setPet).catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!pet) return <p>Loading...</p>;

  return (
    <>
      <Link to="/">Back to all pets</Link>
      <div className="detail">
        {pet.imageUrl ? <img src={pet.imageUrl} alt={pet.name} /> : <div className="noimg">No photo</div>}
        <div>
          <h1>{pet.name}</h1>
          {/* Details requested in the brief: breed, age, location */}
          <dl>
            <dt>Species</dt><dd>{pet.species}</dd>
            <dt>Breed</dt><dd>{pet.breed}</dd>
            <dt>Age</dt><dd>{pet.age} years</dd>
            <dt>Gender</dt><dd>{pet.gender}</dd>
            <dt>Location</dt><dd>{pet.location}</dd>
          </dl>
          <p>{pet.description}</p>
          <span className={`badge ${pet.status.toLowerCase()}`}>{pet.status}</span>
        </div>
      </div>

      {/* Only show the form while the pet can still be adopted */}
      {pet.status === "Available" ? (
        <AdoptionForm petId={pet._id} />
      ) : (
        <p className="muted">{pet.name} has found a home. Browse other pets to adopt.</p>
      )}
    </>
  );
}
