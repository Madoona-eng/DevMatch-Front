import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");
  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    axios
      .get(`http://localhost:5000/api/auth/verify-email?token=${token}&email=${email}`)
      .then(res => {
        if (res.data.message?.toLowerCase().includes('already')) {
          window.location.replace('/login?verified=already');
        } else if (res.data.message?.toLowerCase().includes('success')) {
          window.location.replace('/login?verified=success');
        } else {
          setMessage(res.data.message || 'Verification failed');
        }
      })
      .catch(err => {
        if (err.response?.data?.message?.toLowerCase().includes('already')) {
          window.location.replace('/login?verified=already');
        } else if (err.response?.data?.message?.toLowerCase().includes('invalid')) {
          window.location.replace('/login?error=invalidtoken');
        } else if (err.response?.data?.message?.toLowerCase().includes('not found')) {
          window.location.replace('/login?error=notfound');
        } else {
          setMessage(err.response?.data?.message || "Verification failed");
        }
      });
  }, [searchParams]);
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow text-center">
        <h4 className="mb-3">Email Verification</h4>
        <div>{message}</div>
      </div>
    </div>
  );
}
