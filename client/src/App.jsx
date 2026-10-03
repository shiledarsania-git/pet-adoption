// NavLink = a link that knows whether it is the current page (so we can highlight it).
// Routes/Route decide which page component to show for which URL.
import { NavLink, Routes, Route } from "react-router-dom";
// The three pages of our app.
import PetList from "./pages/PetList.jsx";
import PetDetail from "./pages/PetDetail.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

// A React component is just a function that returns what the screen should look like.
export default function App() {
  return (
    // A fragment <>...</> groups elements without adding an extra HTML tag.
    <>
      {/* Header shown on every page */}
      <header className="topbar">
        <NavLink to="/" className="brand">Paws Home</NavLink>
        <nav>
          {/* "end" makes "/" active only on the exact home page */}
          <NavLink to="/" end>Find a pet</NavLink>
          <NavLink to="/admin">Shelter admin</NavLink>
        </nav>
      </header>

      {/* The part of the screen that changes with the URL */}
      <main className="container">
        <Routes>
          {/* URL "/" shows the list of pets */}
          <Route path="/" element={<PetList />} />
          {/* URL "/pets/123" shows pet 123. ":id" is a variable part */}
          <Route path="/pets/:id" element={<PetDetail />} />
          {/* URL "/admin" shows the management page */}
          <Route path="/admin" element={<AdminDashboard />} />
          {/* "*" = anything else */}
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}
