import React, { useEffect } from 'react';
import './LanguageFilter.css';

const LANGUAGES = [
  { code: 'all', label: 'All Languages', flag: '🌐' },
  // Indian Languages
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada', flag: '🇮🇳' },
  { code: 'ml', label: 'Malayalam', flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi', flag: '🇮🇳' },
  { code: 'ur', label: 'Urdu', flag: '🇵🇰' },
  // International
  { code: 'es', label: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', label: 'French', flag: '🇫🇷' },
  { code: 'de', label: 'German', flag: '🇩🇪' },
  { code: 'zh', label: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', label: 'Arabic', flag: '🇸🇦' },
  { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', label: 'Korean', flag: '🇰🇷' },
  { code: 'pt', label: 'Portuguese', flag: '🇧🇷' },
  { code: 'ru', label: 'Russian', flag: '🇷🇺' },
];

const STORAGE_KEY = 'newssetu_language_filter';

const LanguageFilter = ({ value, onChange }) => {
  // Restore from localStorage on first mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved !== value) {
      onChange(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const lang = e.target.value;
    localStorage.setItem(STORAGE_KEY, lang);
    onChange(lang);
  };

  const selectedLang = LANGUAGES.find((l) => l.code === value) || LANGUAGES[0];

  return (
    <div className="language-filter-wrapper">
      <span className="language-filter-flag">{selectedLang.flag}</span>
      <select
        id="language-filter-select"
        className="language-filter-select"
        value={value}
        onChange={handleChange}
        aria-label="Filter articles by language"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export { LANGUAGES };
export default LanguageFilter;
