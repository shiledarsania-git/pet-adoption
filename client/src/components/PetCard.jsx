// Link navigates to another page without reloading.
import { Link } from "react-router-dom";

// "props" are inputs passed by the parent component. We take only { pet } out of them.
export default function PetCard({ pet }) {
  return (
    // Clicking the whole card opens /pets/<id>. Template string `${}` inserts the id.
    <Link to={`/pets/${pet._id}`} className="card">
      {/* Show the photo, or a grey box if no imageUrl exists (&&/|| pattern) */}
      {pet.imageUrl ? (
        <img src={pet.imageUrl} alt={pet.name} />
      ) : (
        <div className="noimg">No photo</div>
      )}
      <div className="card-body">
        <h3>{pet.name}</h3>
        {/* Breed and age, the details the brief asked for */}
        <p>{pet.breed}, {pet.age} {pet.age === 1 ? "year" : "years"}</p>
        <p className="muted">{pet.location}</p>
        {/* The class changes with status so CSS can colour it (green vs grey) */}
        <span className={`badge ${pet.status.toLowerCase()}`}>{pet.status}</span>
      </div>
    </Link>
  );
}
