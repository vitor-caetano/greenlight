import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { registerUser, ApiClientError } from "../api/client";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError("");
    setLoading(true);

    try {
      await registerUser({ name, email, password });
      setSuccess(true);
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

  if (success) {
    return (
      <div className="form-page">
        <h1>Check your email</h1>
        <div className="success-card">
          <p>
            We've sent an activation token to <strong>{email}</strong>. Copy
            the token and <Link to="/activate">activate your account</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <h1>Create account</h1>
      <p className="page-subtitle">Join Greenlight today</p>
      <div className="form-card">
        {generalError && <div className="error-banner">{generalError}</div>}
        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {fieldErrors.name && (
              <span className="field-error">{fieldErrors.name}</span>
            )}
          </label>
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
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
      </div>
      <p className="form-footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
