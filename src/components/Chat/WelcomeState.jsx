import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  ArrowRight
} from 'lucide-react';
import { SUGGESTED_PROMPTS } from '../../constants/suggestedPrompts';
import { UI_TRANSLATIONS } from '../../constants/languages';
import './WelcomeState.css';

export default function WelcomeState({
  language,
  onSelectPrompt,
  selectedCategory
}) {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  // Filter prompts matching active category or show top relevant
  const filteredPrompts = selectedCategory
    ? SUGGESTED_PROMPTS.filter(p => p.category === selectedCategory)
    : SUGGESTED_PROMPTS;

  return (
    <div className="welcome-container">
      <div className="welcome-hero">
        <div className="hero-emblem-wrap">
          <ShieldCheck size={42} className="hero-emblem-icon" />
          <div className="hero-sparkle-pill">
            <Sparkles size={12} />
            <span>AI Knowledge Assistant</span>
          </div>
        </div>

        <h2 className="welcome-main-title">{t.welcomeTitle}</h2>
        <p className="welcome-main-desc">{t.welcomeDesc}</p>

        {/* Prototype Advisory */}
        <div className="welcome-phase-alert">
          <span className="phase-indicator"></span>
          <span>
            <strong>Phase: Development / Prototype</strong> — Knowledge base documents are currently being curated by the research team. Try sample queries below to test multilingual retrieval and citation rendering.
          </span>
        </div>
      </div>

      {/* Suggested Queries Grid */}
      <div className="suggested-queries-section">
        <div className="suggested-header">
          <BookOpen size={16} className="suggested-icon" />
          <span className="suggested-title">{t.suggestedQueries}</span>
        </div>

        <div className="prompts-grid">
          {filteredPrompts.slice(0, 6).map((item) => (
            <button
              key={item.id}
              className="prompt-card"
              onClick={() => onSelectPrompt(item.prompt, item.lang)}
            >
              <div className="prompt-card-top">
                <span className="prompt-badge">{item.badge}</span>
                <span className="prompt-lang-indicator">{item.lang.toUpperCase()}</span>
              </div>
              <p className="prompt-text">"{item.prompt}"</p>
              <div className="prompt-card-footer">
                <span className="prompt-action-text">Ask IP Assistant</span>
                <ArrowRight size={14} className="prompt-arrow" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
