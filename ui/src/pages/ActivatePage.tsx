import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { activateUser, ApiClientError } from "../api/client";

export default function ActivatePage() {
  const [token, setToken] = useState("");
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
      await activateUser(token);
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
        <h1>Account activated</h1>
        <p>
          Your account is now active. You can <Link to="/login">login</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="form-page">
      <h1>Activate Account</h1>
      {generalError && <div className="error-banner">{generalError}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Activation Token
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your activation token"
            required
          />
          {fieldErrors.token && (
            <span className="field-error">{fieldErrors.token}</span>
          )}
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Activating…" : "Activate"}
        </button>
      </form>
    </div>
  );
}
