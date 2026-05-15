import React from 'react';
import { motion } from 'framer-motion';
import './styles/About.css';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const FEATURES = [
  { icon: "🔍", title: "Smart Search", desc: "Filter news by keyword, category, bias level, and source — all in one place." },
  { icon: "⚖️", title: "Bias Analysis", desc: "Understand the political and emotional leaning of every article before you read it." },
  { icon: "📊", title: "Analytics Dashboard", desc: "Visualize trends, bias distribution, and reading patterns over time." },
  { icon: "🎤", title: "Text-to-Speech", desc: "Listen to any article hands-free while commuting or multitasking." },
  { icon: "📝", title: "AI Summaries", desc: "Get the key points of any article in seconds — no fluff, just facts." },
  { icon: "🌙", title: "Dark Mode", desc: "Easy on the eyes, day or night. Fully adaptive theme support." },
];

const TECH = [
  {
    label: "Frontend",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.08)",
    items: ["React.js", "Vite", "Framer Motion", "Lucide Icons", "CSS3"],
  },
  {
    label: "Backend",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    items: ["Node.js", "Express.js", "MongoDB", "REST APIs"],
  },
  {
    label: "AI & Analysis",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    items: ["OpenAI GPT", "Bias Detection", "Sentiment Analysis", "Auto Summarization"],
  },
];

const ROADMAP = [
  { icon: "🔮", title: "Enhanced AI", desc: "Smarter bias detection with source credibility scoring.", status: "In Progress", statusColor: "#6366f1" },
  { icon: "🌍", title: "Global Expansion", desc: "Multi-language support and international news sources.", status: "Planned", statusColor: "#10b981" },
  { icon: "📱", title: "Mobile App", desc: "Native iOS and Android apps for on-the-go reading.", status: "Planned", statusColor: "#10b981" },
  { icon: "🤝", title: "Community Features", desc: "User discussions, article sharing, and collaborative fact-checking.", status: "Exploring", statusColor: "#f59e0b" },
];

const STATS = [
  { value: "50K+", label: "Articles Analyzed" },
  { value: "120+", label: "News Sources" },
  { value: "98%", label: "Uptime" },
  { value: "10K+", label: "Active Readers" },
];

const About = ({ onPageChange }) => {
  return (
    <div className="about-page">

      {/* ── Hero ── */}
      <motion.section
        className="about-hero"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <button className="about-back-btn" onClick={() => onPageChange('landing')}>
          ← Back to News
        </button>

        <div className="about-hero-badge">About NewsSetu</div>

        <h1 className="about-hero-title">
          News that <span className="about-accent">informs</span>,<br />
          not just <span className="about-accent-2">overwhelms</span>.
        </h1>

        <p className="about-hero-sub">
          NewsSetu bridges the gap between raw information and real understanding —
          using AI to surface what matters, cut through bias, and help you read smarter.
        </p>

        {/* Stats bar */}
        <motion.div
          className="about-stats"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {STATS.map((s, i) => (
            <motion.div key={i} className="about-stat" variants={fadeUp}>
              <span className="about-stat-value">{s.value}</span>
              <span className="about-stat-label">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <div className="about-body">

        {/* ── Mission ── */}
        <motion.section
          className="about-section"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <div className="about-section-label">Our Mission</div>
          <h2 className="about-section-title">Why we built NewsSetu</h2>
          <p className="about-section-text">
            In a world flooded with headlines, it's harder than ever to know what's real,
            what's biased, and what actually matters. NewsSetu was built to fix that.
            We combine AI-powered analysis with clean design to give you a news experience
            that respects your time and your intelligence.
          </p>
          <p className="about-section-text">
            Whether you're a student, professional, or just a curious reader — NewsSetu
            helps you stay informed without the noise.
          </p>
        </motion.section>

        {/* ── Features ── */}
        <motion.section
          className="about-section"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <div className="about-section-label">Features</div>
          <h2 className="about-section-title">Everything you need to read smarter</h2>

          <motion.div
            className="about-features-grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                className="about-feature-card"
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="about-feature-icon">{f.icon}</div>
                <h3 className="about-feature-title">{f.title}</h3>
                <p className="about-feature-desc">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ── Tech Stack ── */}
        <motion.section
          className="about-section"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <div className="about-section-label">Tech Stack</div>
          <h2 className="about-section-title">Built with modern tools</h2>

          <div className="about-tech-grid">
            {TECH.map((cat, i) => (
              <motion.div
                key={i}
                className="about-tech-card"
                style={{ '--tech-color': cat.color, '--tech-bg': cat.bg }}
                variants={fadeUp}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <div className="about-tech-header">
                  <span className="about-tech-dot" />
                  <h3 className="about-tech-label">{cat.label}</h3>
                </div>
                <ul className="about-tech-list">
                  {cat.items.map((item, idx) => (
                    <li key={idx} className="about-tech-item">
                      <span className="about-tech-check">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Roadmap ── */}
        <motion.section
          className="about-section"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <div className="about-section-label">Roadmap</div>
          <h2 className="about-section-title">What's coming next</h2>

          <div className="about-roadmap">
            {ROADMAP.map((item, i) => (
              <motion.div
                key={i}
                className="about-roadmap-item"
                variants={fadeUp}
                whileHover={{ x: 6, transition: { duration: 0.2 } }}
              >
                <div className="about-roadmap-icon">{item.icon}</div>
                <div className="about-roadmap-body">
                  <div className="about-roadmap-top">
                    <h3 className="about-roadmap-title">{item.title}</h3>
                    <span
                      className="about-roadmap-status"
                      style={{ color: item.statusColor, background: item.statusColor + '18' }}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="about-roadmap-desc">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Team ── */}
        <motion.section
          className="about-section about-team-section"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <div className="about-team-inner">
            <div className="about-team-emoji">👥</div>
            <h2 className="about-team-title">Built by people who care about good journalism</h2>
            <p className="about-team-text">
              NewsSetu is crafted by a small team of developers, designers, and AI enthusiasts
              who believe that access to unbiased, well-presented information is a right —
              not a privilege. We're constantly improving and love hearing from our users.
            </p>
            <a
              href="mailto:hello@newssetu.com"
              className="about-contact-btn"
            >
              Get in touch →
            </a>
          </div>
        </motion.section>

      </div>
    </div>
  );
};

export default About;
