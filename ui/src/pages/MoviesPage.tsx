import { useEffect, useState } from "react";
import { listMovies, ApiClientError } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { Movie, Metadata } from "../types";

export default function MoviesPage() {
  const { logout } = useAuth();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    listMovies({ page, page_size: 20 })
      .then((data) => {
        if (cancelled) return;
        setMovies(data.movies ?? []);
        setMetadata(data.metadata);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiClientError && err.status === 401) {
          logout();
          return;
        }
        setError(
          err instanceof ApiClientError
            ? err.message
            : "failed to load movies"
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, logout]);

  return (
    <div>
      <div className="page-header">
        <h1>Movies</h1>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {loading ? (
        <p className="loading-text">Loading…</p>
      ) : movies.length === 0 ? (
        <p className="empty-text">No movies found.</p>
      ) : (
        <>
          <div className="movies-table-wrap">
            <table className="movies-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Year</th>
                  <th>Runtime</th>
                  <th>Genres</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((m) => (
                  <tr key={m.id}>
                    <td>{m.title}</td>
                    <td>{m.year}</td>
                    <td>{m.runtime} mins</td>
                    <td>
                      {m.genres.map((g) => (
                        <span key={g} className="genre-badge">
                          {g}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {metadata && (
            <div className="pagination">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Previous
              </button>
              <span>
                Page {metadata.current_page} of {metadata.last_page}
              </span>
              <button
                disabled={page >= metadata.last_page}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
