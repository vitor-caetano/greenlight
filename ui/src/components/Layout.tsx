import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/movies" className="nav-brand">
          Greenlight
        </Link>
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/movies">Movies</Link>
              <button onClick={logout} className="btn-link">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
