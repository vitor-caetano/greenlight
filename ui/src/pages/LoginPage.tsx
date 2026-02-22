import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createAuthToken, ApiClientError } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError("");
    setLoading(true);

    try {
      const authToken = await createAuthToken({ email, password });
      login(authToken);
      navigate("/movies", { replace: true });
    } catch (err) {
      if (err instanceof ApiClientError) {
        if (err.errors) setFieldErrors(err.errors);
        else setGeneralError(err.message);
      } else {
        setGeneralError("an unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-page">
      <h1>Welcome back</h1>
      <p className="page-subtitle">Sign in to your account</p>
      <div className="form-card">
        {generalError && <div className="error-banner">{generalError}</div>}
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {fieldErrors.email && (
              <span className="field-error">{fieldErrors.email}</span>
            )}
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {fieldErrors.password && (
              <span className="field-error">{fieldErrors.password}</span>
            )}
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
      <p className="form-footer">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
