import React from 'react';
import Footer from '../components/Footer'; // Make sure the Footer path is correct
import Navbar from '../components/Navbar'; // Make sure the Footer path is correct
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
const specializations = [
  {
    icon: "bi-laptop",
    color: "text-primary",
    title: "Front-end Development",
    desc: "Building responsive and interactive web interfaces.",
  },
  {
    icon: "bi-server",
    color: "text-success",
    title: "Back-end Development",
    desc: "Managing servers, databases, and APIs.",
  },
  {
    icon: "bi-phone-fill",
    color: "text-info",
    title: "Mobile Development",
    desc: "Creating apps for Android and iOS platforms.",
  },
  {
    icon: "bi-graph-up",
    color: "text-warning",
    title: "Data Science",
    desc: "Analyzing data and building predictive models.",
  },
  {
    icon: "bi-cloud-upload",
    color: "text-danger",
    title: "Cloud Computing",
    desc: "Deploying and managing cloud infrastructure.",
  },
  {
    icon: "bi-shield-lock",
    color: "text-dark",
    title: "Cybersecurity",
    desc: "Protecting data and systems from cyber threats.",
  },
  {
    icon: "bi-robot",
    color: "text-secondary",
    title: "Artificial Intelligence",
    desc: "Developing intelligent and automated systems.",
  },
  {
    icon: "bi-brush",
    color: "text-muted",
    title: "UI/UX Design",
    desc: "Designing user-friendly and engaging interfaces.",
  },
];




const whyNafdely = [
  {
    icon: "bi-geo-alt-fill",
    color: "text-primary",
    title: "Local Talent Matching",
    desc: "Find programmers near you based on governorate and specialization — hire smarter and faster.",
  },
  {
    icon: "bi-person-check-fill",
    color: "text-success",
    title: "Skill-Based Hiring",
    desc: "Filter by exact technical skills and assign real coding tasks to test applicants before hiring.",
  },
  {
    icon: "bi-chat-dots-fill",
    color: "text-info",
    title: "Built-in Communication",
    desc: "Communicate in real-time with candidates through integrated chat — no external tools needed.",
  },
  {
    icon: "bi-star-fill",
    color: "text-warning",
    title: "Verified & Rated Profiles",
    desc: "Make better hiring decisions with user ratings, reviews, and verified badges for top programmers.",
  },
  {
    icon: "bi-kanban-fill",
    color: "text-danger",
    title: "All-in-One Dashboard",
    desc: "Manage jobs, tasks, profiles, and messages in a clean, user-friendly interface.",
  },
  {
    icon: "bi-people-fill",
    color: "text-secondary",
    title: "Grow Tech Communities",
    desc: "Support local developers, boost regional job markets, and strengthen the tech scene in every governorate.",
  },
];

export default function HomePage() {
  return (
    <>

      <Navbar />

      <main>
       {/* Hero Section */}
<div className="bg-dark text-white text-center position-relative" style={{
  backgroundImage: "url('https://images.unsplash.com/photo-1517430816045-df4b7de11d1d')",
  backgroundSize: "cover", backgroundPosition: "center", height: "500px"
}}>
  <div className="position-absolute w-100 h-100 bg-dark opacity-75 top-0"></div>
  <div className="position-relative z-2 d-flex flex-column align-items-center justify-content-center h-100">
    <h2 className="fw-bold">Connect with Top Developers. Get Work Done Smarter.</h2>
    <p>Find skilled freelancers to bring your ideas to life — fast, safe, and professional.</p>
    <div className="input-group mt-3 w-75" style={{ maxWidth: "500px" }}>
      <input type="text" className="form-control" placeholder="What project do you want to start?" />
       <button className="btn btn-primary">
    <i className="bi bi-search"></i> Find Developers
  </button>
    </div>
  </div>
</div>


        {/* How it works section */}
        <div className="container py-5">
          <h4 className="text-center mb-4 text-black">🔧 How DevMatch Works</h4>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="ratio ratio-16x9">
                <iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID" title="How it works" allowFullScreen></iframe>
              </div>
            </div>
            <div className="col-md-6 text-black">
              <ul className="list-unstyled">
                <li className="mb-3">
                  <h5 className="fw-bold text-primary">
                    <i className="bi bi-plus-circle me-2"></i> Categorization System
                  </h5>
                  <p>Programmers are organized by skills and geographic location to make search and filtering easy..</p>
                </li>
                <li className="mb-3">
                  <h5 className="fw-bold text-primary">
                    <i className="bi bi-check2-circle me-2"></i>Advanced Search
                  </h5>
                  <p>Users can search for programmers using filters based on specialization and location.</p>
                </li>
                <li className="mb-3">
                  <h5 className="fw-bold text-primary">
                    <i className="bi bi-box-arrow-in-down me-2"></i>Job Posting
                  </h5>
                  <p>Programmers can browse job ads and apply for suitable opportunities..</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

       {/* Why Nafdely Section */}
<div className="container bg-light text-black text-center py-5">
 <h3 className="mb-5 d-flex align-items-center justify-content-center gap-2">
  <i className="bi bi-check-circle fs-3 text-success"></i>
  Why Choose DevMatch?
</h3>
  <div className="row g-5">
    {whyNafdely.map((item, idx) => (
      <div key={idx} className="col-md-4">
        <div className="mb-3">
          <i className={`bi ${item.icon} fs-1 ${item.color}`}></i>
        </div>
        <h5 className="fw-bold">{item.title}</h5>
        <p className="text-muted">{item.desc}</p>
      </div>
    ))}
  </div>
</div>


       {/* Specializations Section */}
<div className="container text-black text-center py-5">
  <h3 className="mb-5 d-flex align-items-center justify-content-center gap-2">
  <i className="bi bi-people-fill fs-3 text-primary"></i>
  Our Community
</h3>
  <div className="row g-5">
    {specializations.map((item, idx) => (
      <div key={idx} className="col-md-3">
        <div className="mb-3">
          <i className={`bi ${item.icon} fs-1 ${item.color}`}></i>
        </div>
        <h5 className="fw-bold">{item.title}</h5>
        <p className="text-muted">{item.desc}</p>
      </div>
    ))}
  </div>
</div>

      </main>

      <Footer />
    </>
  );
}
