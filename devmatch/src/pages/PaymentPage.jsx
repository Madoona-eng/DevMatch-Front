import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51RdCVXRKGklPGArpjnFtTUia6Fe7Es8Ndeb5wjxXp4LQPknw1JFHCHpeSqFWOSNqqaiB74Dl07MJh3Ly73MGD5M000PTAeqxAe');

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const navigate = useNavigate();

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('devmatch_user'));
  const userId = user?.id;
  const name = user?.name || '';

  // Only create PaymentIntent on backend, and only when amount is set
  useEffect(() => {
    if (amount && userId && name) {
      setClientSecret('');
      setMessage('');
      setLoading(true);
      axios.post('http://localhost:5000/api/payments/create', {
        userId,
        amount: Number(amount),
        method: 'card',
        name
      })
        .then(res => {
          setClientSecret(res.data.clientSecret);
        })
        .catch(err => {
          setMessage(err.response?.data?.message || 'Failed to initiate payment');
        })
        .finally(() => setLoading(false));
    }
  }, [amount, userId, name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!stripe || !elements || !clientSecret) return;
    setLoading(true);
    try {
      // Only confirm payment intent using client secret
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name },
        },
      });
      if (result.error) {
        setMessage(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        setMessage('Payment successful! Redirecting...');
        // Set recruiterPaid=1 and update user.isPaid in localStorage
        localStorage.setItem('recruiterPaid', '1');
        if (user) {
          const updatedUser = { ...user, isPaid: true };
          localStorage.setItem('devmatch_user', JSON.stringify(updatedUser));
          // Update isPaid in the backend for this user (no userId in body, use auth token)
          const token = user.token || localStorage.getItem('token');
          axios.put('http://localhost:5000/api/users/recruiter/mark-paid', {}, {
            headers: {
              Authorization: token ? `Bearer ${token}` : ''
            }
          })
            .catch(() => {/* ignore error, UI will still update locally */});
        }
        setTimeout(() => {
          navigate('/recruiter-dashboard?fromPayment=1&tab=jobs');
        }, 1200);
      }
    } catch (err) {
      setMessage('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label fw-semibold text-primary">Name on Card</label>
        <input type="text" className="form-control" placeholder="Cardholder Name" required value={name} disabled />
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold text-primary">Card Details</label>
        <div className="form-control p-2">
          <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
        </div>
      </div>
      <div className="mb-4">
        <label className="form-label fw-semibold text-primary">Amount</label>
        <input type="number" className="form-control" placeholder="$100.00" required min="1" value={amount} onChange={e => setAmount(e.target.value)} />
      </div>
      <button type="submit" className="btn btn-primary w-100 py-2 fw-bold rounded-pill" disabled={!stripe || !clientSecret || loading}>
        {loading ? 'Processing...' : 'Pay with Stripe'}
      </button>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </form>
  );
}

export default function PaymentPage() {
  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow border-0 rounded-4">
              <div className="card-header bg-primary text-white text-center rounded-top-4">
                <h3 className="mb-0">Payment</h3>
                <p className="mb-0">Secure Stripe Checkout</p>
              </div>
              <div className="card-body p-4">
                <Elements stripe={stripePromise}>
                  <PaymentForm />
                </Elements>
                <div className="text-center mt-4">
                  <small className="text-muted">
                    <i className="bi bi-lock-fill me-1"></i>
                    Your payment is secure and encrypted
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
