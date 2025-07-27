import React from 'react';
import './styles/Summary.css';

const Summary = () => {
  return (
    <div className="summary-container">
      <h1 className="logo">NewsSetu</h1>

      <div className="summary-box">
        <div className="source-date">
          <span className="source">Reuters</span>
            <span className="bullet">•</span>
          <span className="date">January 15, 2024 at 04:00 PM</span>
        </div>

        <h2 className="headline">
          "Global Climate Summit Reaches Historic Agreement on Carbon Reduction Targets Which Is A Great News."
        </h2>

        <div className="image-and-points">
          <img
            className="summary-image"
            src="https://i.pinimg.com/736x/4c/e7/57/4ce757e37b91088187ca383c0e495302.jpg"
            alt="Newsroom"
          />

          <div className="key-points">
            <h3>Key Points</h3>
            <ul>
              <li>195 countries agree to reduce carbon emissions by 45% before 2030</li>
              <li>New $100 billion climate fund established for developing nations</li>
              <li>Renewable energy targets set at 70% of global energy mix by 2035</li>
              <li>Binding enforcement mechanisms included for the first time</li>
              <li>Major oil companies commit to carbon neutrality by 2050</li>
            </ul>


             <button className="bias-button">Bias Detector</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;