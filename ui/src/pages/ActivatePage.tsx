import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { activateUser, resendActivationCode, ApiClientError } from "../api/client";

export default function ActivatePage() {
  const location = useLocation();
  const email = (location.state as { email?: string })?.email ?? "";

  const [digits, setDigits] = useState(Array(6).fill(""));
  const [generalError, setGeneralError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [resendMessage, setResendMessage] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  const isExpired = timeLeft <= 0;
  const isComplete = digits.every((d) => d !== "");

  function handleDigitChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === 5 && newDigits.every((d) => d !== "")) {
      handleVerify(newDigits.join(""));
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerify(codeToVerify = digits.join("")) {
    setGeneralError("");
    setFieldError("");
    setLoading(true);

    try {
      await activateUser(codeToVerify);
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiClientError) {
        if (err.errors?.token) setFieldError(err.errors.token);
        else setGeneralError(err.message);
      } else {
        setGeneralError("an unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email) return;
    setResendMessage("");
    setGeneralError("");
    setFieldError("");

    try {
      await resendActivationCode(email);
      setTimeLeft(10 * 60);
      setDigits(Array(6).fill(""));
      setResendMessage("A new code has been sent to your email.");
      inputRefs.current[0]?.focus();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setGeneralError(err.message);
      } else {
        setGeneralError("Failed to resend code.");
      }
    }
  }

  if (success) {
    return (
      <div className="form-page">
        <h1>Account activated</h1>
        <div className="success-card">
          <p>
            Your account is now active. You can{" "}
            <Link to="/login">sign in</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="otp-envelope">✉</div>
      <h1>Verify Your Email</h1>
      <p className="page-subtitle">
        We've sent a 6-digit verification code to
      </p>
      {email && <div className="otp-email-badge">{email}</div>}

      <div className="form-card">
        {generalError && <div className="error-banner">{generalError}</div>}
        {fieldError && <div className="error-banner">{fieldError}</div>}
        {resendMessage && (
          <div className="success-card" style={{ marginTop: 0, marginBottom: "1rem" }}>
            <p>{resendMessage}</p>
          </div>
        )}

        <div className="otp-inputs">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              autoFocus={i === 0}
              className="otp-input"
            />
          ))}
        </div>

        <div className="otp-timer">
          {isExpired ? (
            <span className="otp-expired">Code expired</span>
          ) : (
            <span className="otp-countdown">{minutes}:{seconds}</span>
          )}
        </div>

        <button
          className="otp-verify-btn"
          onClick={() => handleVerify()}
          disabled={loading || !isComplete || isExpired}
        >
          {loading ? "Verifying…" : "Verify Email"}
        </button>

        <div className="otp-resend">
          <span>Didn't receive the code? </span>
          <button className="link-btn" onClick={handleResend}>
            Resend verification code
          </button>
        </div>
      </div>
    </div>
  );
}
