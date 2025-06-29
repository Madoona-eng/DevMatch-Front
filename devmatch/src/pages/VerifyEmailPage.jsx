// src/pages/VerifyEmailPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setMessage("Missing verification data.");
      return;
    }

    axios
      .get(`http://localhost:5000/api/auth/verify-email?token=${token}&email=${email}`)
      .then((res) => {
        const msg = res.data.message?.toLowerCase();
        if (msg.includes("already")) {
          navigate("/login?verified=already");
        } else if (msg.includes("success")) {
          navigate("/login?verified=success");
        } else {
          setMessage("Unexpected verification result.");
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message?.toLowerCase();
        if (msg.includes("invalid")) {
          navigate("/login?error=invalidtoken");
        } else if (msg.includes("not found")) {
          navigate("/login?error=notfound");
        } else {
          setMessage("Verification failed. Please try again.");
        }
      });
  }, [searchParams, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow text-center">
        <h4>Email Verification</h4>
        <p>{message}</p>
      </div>
    </div>
  );
}

// Optionally, delete the VerifyEmailPage.jsx file since it's no longer needed
