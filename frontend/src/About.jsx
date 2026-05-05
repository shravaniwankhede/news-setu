import React from 'react';
import { motion } from 'framer-motion';
import './styles/About.css';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const About = ({ onPageChange }) => {
  return (
    <div className="about-container">

      {/* HEADER */}
      <motion.div 
        className="about-header"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        <button className="back-btn" onClick={() => onPageChange('landing')}>
          ← Back to News
        </button>

        <h1 className="about-title">
          <span>📰</span> About <span className="highlight">NewsSetu</span>
        </h1>

        <p className="about-subtitle">
          Bridging the gap between information and understanding with AI-powered insights.
        </p>
      </motion.div>

      {/* CONTENT */}
      <div className="about-content">

        {/* MISSION */}
        <motion.div 
          className="about-section glass"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2>🎯 Our Mission</h2>
          <p>
            NewsSetu is a next-generation news platform designed to provide unbiased,
            comprehensive coverage powered by AI. We help users cut through noise,
            understand bias, and make informed decisions in today’s complex media world.
          </p>
        </motion.div>

        {/* FEATURES */}
        <motion.div 
          className="about-section"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
        >
          <h2>🚀 Key Features</h2>

          <div className="features-grid">
            {[
              { icon: "🔍", title: "Smart Search", desc: "Advanced filtering with bias & category control." },
              { icon: "⚖️", title: "Bias Analysis", desc: "Understand political & emotional leanings." },
              { icon: "📊", title: "Analytics", desc: "Visualize trends & bias distribution." },
              { icon: "🎤", title: "Text-to-Speech", desc: "Hands-free listening experience." },
              { icon: "📝", title: "AI Summaries", desc: "Quickly grasp key points." },
              { icon: "🌙", title: "Dark Mode", desc: "Comfortable reading anytime." },
            ].map((f, i) => (
              <motion.div 
                key={i}
                className="feature-card"
                whileHover={{ scale: 1.05 }}
              >
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* TECH STACK */}
        <motion.div 
          className="about-section"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
        >
          <h2>🛠️ Technology Stack</h2>

          <div className="tech-stack">
            {[
              {
                title: "Frontend",
                items: ["React.js", "Vite", "CSS3", "Lucide Icons"]
              },
              {
                title: "Backend",
                items: ["Node.js", "Express.js", "MongoDB", "OpenAI API"]
              },
              {
                title: "AI & Analysis",
                items: ["GPT Models", "Bias Detection", "Sentiment Analysis", "Summarization"]
              }
            ].map((cat, i) => (
              <div key={i} className="tech-card">
                <h3>{cat.title}</h3>
                <ul>
                  {cat.items.map((item, idx) => (
                    <li key={idx}>✔ {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* TEAM */}
        <motion.div 
          className="about-section glass"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
        >
          <h2>👥 Our Team</h2>
          <p>
            Built by developers, designers, and AI enthusiasts passionate about
            transparency in media. We combine technology and journalism principles
            to create meaningful digital experiences.
          </p>
        </motion.div>

        {/* ROADMAP */}
        <motion.div 
          className="about-section"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
        >
          <h2>🎯 Future Roadmap</h2>

          <div className="roadmap">
            {[
              ["🔮", "Enhanced AI", "Better bias detection & insights"],
              ["🌍", "Global Expansion", "Multi-language & international sources"],
              ["📱", "Mobile App", "iOS & Android apps"],
              ["🤝", "Community", "User discussions & sharing"],
            ].map((item, i) => (
              <div key={i} className="roadmap-item">
                <div className="roadmap-icon">{item[0]}</div>
                <div>
                  <h3>{item[1]}</h3>
                  <p>{item[2]}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default About;