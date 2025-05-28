import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-3">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
<a className="navbar-brand" href="#">
  <img src="https://raw.githubusercontent.com/abanoub1234/kkkk/refs/heads/main/new.png" alt="DevMatch Logo" style={{ height: '30px' }} />
</a>
        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><a className="nav-link" href="#">Services</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Portfolios</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Comunity</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Freelancers</a></li>
          </ul>
          <div>
            <button className="btn btn-outline-primary mx-1">Login</button>
            <button className="btn btn-primary">Sign Up</button>
          </div>
        </div>
      </div>
    </nav>
  );
}