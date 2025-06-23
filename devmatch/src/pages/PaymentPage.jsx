import React from 'react';
import Navbar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

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
                <form>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-primary">Name on Card</label>
                    <input type="text" className="form-control" placeholder="Cardholder Name" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-primary">Card Number</label>
                    <input type="text" className="form-control" placeholder="1234 5678 9012 3456" required />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold text-primary">Expiry Date</label>
                      <input type="text" className="form-control" placeholder="MM/YY" required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold text-primary">CVC</label>
                      <input type="text" className="form-control" placeholder="CVC" required />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-primary">Amount</label>
                    <input type="number" className="form-control" placeholder="$100.00" required min="1" />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 py-2 fw-bold rounded-pill">
                    Pay with Stripe
                  </button>
                </form>
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
