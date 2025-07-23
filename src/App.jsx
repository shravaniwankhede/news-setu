// file.jsx
import React from "react";

const LandingPage = () => {
  const categories = ["Politics", "Sports", "Technology", "Health", "World"];
  const news = [
    {
      title: "India Launches New Satellite for Weather Monitoring",
      image: "https://source.unsplash.com/400x250/?satellite",
      description: "ISRO’s latest launch promises improved weather forecasting.",
    },
    {
      title: "Olympics 2025: India Wins Gold in Wrestling",
      image: "https://source.unsplash.com/400x250/?sports",
      description: "A historic moment as Indian athletes bring home gold.",
    },
    {
      title: "AI Revolutionizing Healthcare in Rural Areas",
      image: "https://source.unsplash.com/400x250/?healthcare",
      description: "Startups are bringing AI-powered clinics to villages.",
    },
  ];

  return (
    <div className="font-sans bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">NewsSetu</h1>
          <nav className="space-x-6">
            {categories.map((cat) => (
              <a key={cat} href="#" className="text-sm font-medium hover:text-blue-500">
                {cat}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Stay Informed with Trusted News</h2>
          <p className="text-lg text-gray-600 mb-6">
            Get unbiased, multilingual coverage across all domains — from local headlines to global stories.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">
            Explore Latest News
          </button>
        </div>
      </section>

      {/* Featured News */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h3 className="text-2xl font-semibold mb-6">Top Headlines</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow hover:shadow-lg transition">
              <img src={item.image} alt={item.title} className="rounded-t-xl w-full h-48 object-cover" />
              <div className="p-4">
                <h4 className="text-lg font-bold">{item.title}</h4>
                <p className="text-sm text-gray-600 mt-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6">
        © 2025 NewsSetu. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;

