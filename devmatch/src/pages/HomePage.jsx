import React, { useState } from 'react';
import Footer from '../components/Footer'; // Make sure the Footer path is correct
import Navbar from '../components/Navbar'; // Make sure the Footer path is correct
import ChatBot from '../components/ChatBot';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const specializations = [
  {
    icon: "bi-laptop",
    color: "text-primary",
    title: { en: "Front-end Development", ar: "تطوير الواجهة الأمامية" },
    desc: { en: "Building responsive and interactive web interfaces.", ar: "بناء واجهات ويب تفاعلية ومتجاوبة." },
  },
  {
    icon: "bi-server",
    color: "text-success",
    title: { en: "Back-end Development", ar: "تطوير الخلفية" },
    desc: { en: "Managing servers, databases, and APIs.", ar: "إدارة الخوادم وقواعد البيانات وواجهات البرمجة." },
  },
  {
    icon: "bi-phone-fill",
    color: "text-info",
    title: { en: "Mobile Development", ar: "تطوير تطبيقات الجوال" },
    desc: { en: "Creating apps for Android and iOS platforms.", ar: "إنشاء تطبيقات لمنصات أندرويد وiOS." },
  },
  {
    icon: "bi-graph-up",
    color: "text-warning",
    title: { en: "Data Science", ar: "علم البيانات" },
    desc: { en: "Analyzing data and building predictive models.", ar: "تحليل البيانات وبناء نماذج تنبؤية." },
  },
  {
    icon: "bi-cloud-upload",
    color: "text-danger",
    title: { en: "Cloud Computing", ar: "الحوسبة السحابية" },
    desc: { en: "Deploying and managing cloud infrastructure.", ar: "نشر وإدارة البنية التحتية السحابية." },
  },
  {
    icon: "bi-shield-lock",
    color: "text-dark",
    title: { en: "Cybersecurity", ar: "الأمن السيبراني" },
    desc: { en: "Protecting data and systems from cyber threats.", ar: "حماية البيانات والأنظمة من التهديدات الإلكترونية." },
  },
  {
    icon: "bi-robot",
    color: "text-secondary",
    title: { en: "Artificial Intelligence", ar: "الذكاء الاصطناعي" },
    desc: { en: "Developing intelligent and automated systems.", ar: "تطوير أنظمة ذكية ومؤتمتة." },
  },
  {
    icon: "bi-brush",
    color: "text-muted",
    title: { en: "UI/UX Design", ar: "تصميم واجهات المستخدم وتجربة المستخدم" },
    desc: { en: "Designing user-friendly and engaging interfaces.", ar: "تصميم واجهات سهلة وجذابة للمستخدم." },
  },
];

const whyNafdely = [
  {
    icon: "bi-geo-alt-fill",
    color: "text-primary",
    title: { en: "Local Talent Matching", ar: "مطابقة المواهب المحلية" },
    desc: { en: "Find programmers near you based on governorate and specialization — hire smarter and faster.", ar: "ابحث عن المبرمجين بالقرب منك حسب المحافظة والتخصص — وظف بشكل أذكى وأسرع." },
  },
  {
    icon: "bi-person-check-fill",
    color: "text-success",
    title: { en: "Skill-Based Hiring", ar: "توظيف بناءً على المهارات" },
    desc: { en: "Filter by exact technical skills and assign real coding tasks to test applicants before hiring.", ar: "صفِّ المرشحين حسب المهارات التقنية وحدد مهام برمجية حقيقية لاختبارهم قبل التوظيف." },
  },
  {
    icon: "bi-chat-dots-fill",
    color: "text-info",
    title: { en: "Built-in Communication", ar: "تواصل مدمج" },
    desc: { en: "Communicate in real-time with candidates through integrated chat — no external tools needed.", ar: "تواصل مع المرشحين مباشرة عبر الدردشة المدمجة — دون الحاجة لأدوات خارجية." },
  },
  {
    icon: "bi-star-fill",
    color: "text-warning",
    title: { en: "Verified & Rated Profiles", ar: "ملفات موثقة وتقييمات" },
    desc: { en: "Make better hiring decisions with user ratings, reviews, and verified badges for top programmers.", ar: "اتخذ قرارات توظيف أفضل مع التقييمات والمراجعات والشارات الموثقة لأفضل المبرمجين." },
  },
  {
    icon: "bi-kanban-fill",
    color: "text-danger",
    title: { en: "All-in-One Dashboard", ar: "لوحة تحكم شاملة" },
    desc: { en: "Manage jobs, tasks, profiles, and messages in a clean, user-friendly interface.", ar: "إدارة الوظائف والمهام والملفات والرسائل في واجهة سهلة الاستخدام." },
  },
  {
    icon: "bi-people-fill",
    color: "text-secondary",
    title: { en: "Grow Tech Communities", ar: "تنمية المجتمعات التقنية" },
    desc: { en: "Support local developers, boost regional job markets, and strengthen the tech scene in every governorate.", ar: "دعم المطورين المحليين وتعزيز سوق العمل التقني في كل محافظة." },
  },
];

const translations = {
  en: {
    heroTitle: "Connect with Top Developers. Get Work Done Smarter.",
    heroDesc: "Find skilled freelancers to bring your ideas to life — fast, safe, and professional.",
    heroPlaceholder: "What project do you want to start?",
    heroBtn: "Find Developers",
    howItWorks: "How DevMatch Works",
    how1: "Categorization System",
    how1Desc: "Programmers are organized by skills and geographic location to make search and filtering easy..",
    how2: "Advanced Search",
    how2Desc: "Users can search for programmers using filters based on specialization and location.",
    how3: "Job Posting",
    how3Desc: "Programmers can browse job ads and apply for suitable opportunities..",
    whyTitle: "Why Choose DevMatch?",
    community: "Our Community",
    translate: "العربية",
  },
  ar: {
    heroTitle: "تواصل مع أفضل المطورين. أنجز عملك بذكاء.",
    heroDesc: "ابحث عن مستقلين مهرة لتحقيق أفكارك بسرعة وأمان واحترافية.",
    heroPlaceholder: "ما المشروع الذي تريد البدء به؟",
    heroBtn: "ابحث عن مطورين",
    howItWorks: "كيف يعمل ديف ماتش",
    how1: "نظام التصنيف",
    how1Desc: "يتم تنظيم المبرمجين حسب المهارات والموقع الجغرافي لتسهيل البحث والفرز.",
    how2: "بحث متقدم",
    how2Desc: "يمكن للمستخدمين البحث عن المبرمجين باستخدام فلاتر التخصص والموقع.",
    how3: "نشر الوظائف",
    how3Desc: "يمكن للمبرمجين تصفح إعلانات الوظائف والتقديم للفرص المناسبة.",
    whyTitle: "لماذا تختار ديف ماتش؟",
    community: "مجتمعنا",
    translate: "English",
  }
};

export default function HomePage() {
  const [showChat, setShowChat] = useState(false);
  const [lang, setLang] = useState('en');
  const t = translations[lang];
  return (
    <>
      <Navbar
        rightElement={
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            style={{
              background: '#fff',
              color: '#2563eb',
              borderRadius: 8,
              border: '1px solid #2563eb',
              width: 36,
              height: 36,
              fontWeight: 'bold',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              cursor: 'pointer',
              marginRight: 8, // use marginRight instead of marginLeft for far right
              padding: 0
            }}
            aria-label="Toggle language"
          >
            {lang === 'en' ? 'Ar' : 'En'}
          </button>
        }
        lang={lang}
      />
      {/* زر أيقونة الشات بوت */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: '#2563eb', color: 'white', borderRadius: '50%', width: 56, height: 56, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          aria-label="Open ChatBot"
        >
          <i className="bi bi-robot" style={{ fontSize: 28 }}></i>
        </button>
      )}
      {/* نافذة الشات بوت */}
      {showChat && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
          <ChatBot onClose={() => setShowChat(false)} />
        </div>
      )}
      <main dir={lang === 'ar' ? 'rtl' : 'ltr'}>
       {/* Hero Section */}
<div className="bg-dark text-white text-center position-relative" style={{
  backgroundImage: "url('https://images.unsplash.com/photo-1517430816045-df4b7de11d1d')",
  backgroundSize: "cover", backgroundPosition: "center", height: "500px"
}}>
  <div className="position-absolute w-100 h-100 bg-dark opacity-75 top-0"></div>
  <div className="position-relative z-2 d-flex flex-column align-items-center justify-content-center h-100">
    <h2 className="fw-bold">{t.heroTitle}</h2>
    <p>{t.heroDesc}</p>
    <div className="input-group mt-3 w-75" style={{ maxWidth: "500px" }}>
      <input type="text" className="form-control" placeholder={t.heroPlaceholder} />
       <button className="btn btn-primary">
    <i className="bi bi-search"></i> {t.heroBtn}
  </button>
    </div>
  </div>
</div>

        {/* How it works section */}
        <div className="container py-5">
          <h4 className="text-center mb-4 text-black">🔧 {t.howItWorks}</h4>
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
                    <i className="bi bi-plus-circle me-2"></i> {t.how1}
                  </h5>
                  <p>{t.how1Desc}</p>
                </li>
                <li className="mb-3">
                  <h5 className="fw-bold text-primary">
                    <i className="bi bi-check2-circle me-2"></i>{t.how2}
                  </h5>
                  <p>{t.how2Desc}</p>
                </li>
                <li className="mb-3">
                  <h5 className="fw-bold text-primary">
                    <i className="bi bi-box-arrow-in-down me-2"></i>{t.how3}
                  </h5>
                  <p>{t.how3Desc}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

       {/* Why Nafdely Section */}
<div className="container bg-light text-black text-center py-5">
 <h3 className="mb-5 d-flex align-items-center justify-content-center gap-2">
  <i className="bi bi-check-circle fs-3 text-success"></i>
  {t.whyTitle}
</h3>
  <div className="row g-5">
    {whyNafdely.map((item, idx) => (
      <div key={idx} className="col-md-4">
        <div className="mb-3">
          <i className={`bi ${item.icon} fs-1 ${item.color}`}></i>
        </div>
        <h5 className="fw-bold">{item.title[lang]}</h5>
        <p className="text-muted">{item.desc[lang]}</p>
      </div>
    ))}
  </div>
</div>

       {/* Specializations Section */}
<div className="container text-black text-center py-5">
  <h3 className="mb-5 d-flex align-items-center justify-content-center gap-2">
  <i className="bi bi-people-fill fs-3 text-primary"></i>
  {t.community}
</h3>
  <div className="row g-5">
    {specializations.map((item, idx) => (
      <div key={idx} className="col-md-3">
        <div className="mb-3">
          <i className={`bi ${item.icon} fs-1 ${item.color}`}></i>
        </div>
        <h5 className="fw-bold">{item.title[lang]}</h5>
        <p className="text-muted">{item.desc[lang]}</p>
      </div>
    ))}
  </div>
</div>

      </main>

      <Footer />
    </>
  );
}