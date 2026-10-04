import React from 'react';
import { 
  ShieldCheck, 
  FileBadge, 
  Gamepad2, 
  Flower2, 
  ArrowRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import DevelopmentBadge from '../common/DevelopmentBadge';
import './EmptyState.css';

const CATEGORY_CARDS = [
  {
    id: 'patents',
    title: 'Patents',
    icon: FileBadge,
    desc: 'Statutory requirements, Form 1–30, novelty examination & claims',
    color: '#3B82F6',
    query: 'What mandatory forms and documents are required to file a patent application in India?'
  },
  {
    id: 'trademarks',
    title: 'Trademarks',
    icon: ShieldCheck,
    desc: 'Nice Classification (Class 1–45), Form TM-A, examination standards',
    color: '#8B5CF6',
    query: 'How do I choose the correct Nice Classification class for an AI software SaaS platform under TM-A?'
  },
  {
    id: 'bis_toys',
    title: 'BIS / Toys',
    icon: Gamepad2,
    desc: 'Mandatory BIS QCO standards, IS 9873 heavy metal limits, electric safety',
    color: '#06B6D4',
    query: 'Which BIS standards (IS 9873) are mandatory for manufacturing and importing electric and non-electric toys in India?'
  },
  {
    id: 'ayush',
    title: 'Ayush',
    icon: Flower2,
    desc: 'TKDL traditional knowledge formulations & National Biodiversity clearance',
    color: '#84CC16',
    query: 'पारंपरिक आयुर्वेदिक योगों को विदेशी पेटेंट चोरी (बायो-पायरेसी) से बचाने में TKDL डेटाबेस कैसे मदद करता है?'
  }
];

const EXAMPLE_QUESTIONS = [
  {
    id: 'ex1',
    lang: 'mr',
    badge: 'पेटंट कागदपत्रे (मराठी)',
    text: 'Patent application sathi konti documents lagtil?'
  },
  {
    id: 'ex2',
    lang: 'en',
    badge: 'Patent Filing',
    text: 'What mandatory forms and documents are required to file a patent application in India?'
  },
  {
    id: 'ex3',
    lang: 'en',
    badge: 'BIS Toy Standards',
    text: 'Which BIS standards (IS 9873) are mandatory for manufacturing and importing electric and non-electric toys in India?'
  },
  {
    id: 'ex4',
    lang: 'hi',
    badge: 'आयुष एवं TKDL',
    text: 'पारंपरिक आयुर्वेदिक योगों को विदेशी पेटेंट चोरी (बायो-पायरेसी) से बचाने में TKDL डेटाबेस कैसे मदद करता है?'
  }
];

export default function EmptyState({ onSelectPrompt }) {
  return (
    <div className="welcome-empty-container">
      {/* Central Hero Header */}
      <div className="welcome-header-center">
        <div className="hero-emblem-badge">
          <ShieldCheck size={36} className="emblem-shield-icon" />
          <div className="emblem-glow"></div>
        </div>

        <div className="welcome-mode-tag">
          <DevelopmentBadge variant="mode" label="Development Mode" />
        </div>

        <h2 className="welcome-headline">Welcome to IP-SAKTI Sahayak</h2>
        <p className="welcome-subheadline">
          Ask questions about Intellectual Property, BIS/Toys and Ayush regulatory guidance.
        </p>

        {/* Prototype Transparency Notice */}
        <div className="welcome-transparency-card">
          <div className="transparency-dot"></div>
          <p className="transparency-text">
            <strong>Prototype Status:</strong> Knowledge base documents are currently in active collection by our research team. Answers and citations are generated as simulated test evidence to evaluate interface workflows and RAG data contracts.
          </p>
        </div>
      </div>

      {/* 4 Focused Category Cards */}
      <div className="welcome-section-group">
        <div className="group-label-row">
          <Sparkles size={14} className="group-label-icon" />
          <span className="group-label-text">Select a Core Knowledge Domain</span>
        </div>

        <div className="category-cards-grid">
          {CATEGORY_CARDS.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                className="category-card"
                onClick={() => onSelectPrompt(cat.query)}
              >
                <div className="cat-card-header">
                  <div className="cat-card-icon-box" style={{ color: cat.color }}>
                    <Icon size={18} />
                  </div>
                  <h3 className="cat-card-title">{cat.title}</h3>
                </div>
                <p className="cat-card-desc">{cat.desc}</p>
                <div className="cat-card-footer">
                  <span className="cat-action-hint">Explore questions</span>
                  <ArrowRight size={13} className="cat-arrow" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clickable Example Questions */}
      <div className="welcome-section-group">
        <div className="group-label-row">
          <HelpCircle size={14} className="group-label-icon" />
          <span className="group-label-text">Sample Inquiries for Prototype Demonstration</span>
        </div>

        <div className="example-prompts-grid">
          {EXAMPLE_QUESTIONS.map((item) => (
            <button
              key={item.id}
              className="example-prompt-item"
              onClick={() => onSelectPrompt(item.text, item.lang)}
            >
              <div className="prompt-top-meta">
                <span className="prompt-tag-badge">{item.badge}</span>
                <span className="prompt-lang-tag">{item.lang.toUpperCase()}</span>
              </div>
              <p className="prompt-content-text">"{item.text}"</p>
              <div className="prompt-hover-trigger">
                <span>Ask IP-SAKTI</span>
                <ArrowRight size={12} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
