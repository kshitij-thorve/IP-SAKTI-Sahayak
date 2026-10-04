import React, { useRef, useEffect } from 'react';
import { Send, Globe, Paperclip } from 'lucide-react';
import './ChatInput.css';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'mr', label: 'मराठी' }
];

export default function ChatInput({
  input,
  setInput,
  onSend,
  isLoading,
  language,
  setLanguage,
  onOpenUpload,
  selectedCategory
}) {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSend();
      }
    }
  };

  const placeholderText = language === 'mr'
    ? 'पेटंट, ट्रेडमार्क, किंवा इतर बौद्धिक संपदा प्रश्न विचारा...'
    : language === 'hi'
    ? 'पेटेंट, ट्रेडमार्क, बीआईएस खिलौने या आयुष संबंधी प्रश्न पूछें...'
    : 'Ask a question about Patents, Trademarks, BIS/Toys, or Ayush...';

  return (
    <div className="chat-input-wrapper">
      <div className="chat-input-container">
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          disabled={isLoading}
          aria-label="Message input"
        />

        <div className="input-actions-bar">
          <div className="input-tools-left">
            {/* Optional Attachment/Upload Button */}
            <button
              type="button"
              className="tool-icon-btn"
              onClick={onOpenUpload}
              title="View document ingestion status"
              aria-label="Document upload info"
            >
              <Paperclip size={15} />
            </button>

            {/* Quick Language Selector */}
            <div className="input-lang-pills">
              <Globe size={12} className="globe-icon" />
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  className={`lang-pill ${lang.code === language ? 'active' : ''}`}
                  onClick={() => setLanguage(lang.code)}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {selectedCategory && (
              <span className="active-category-indicator">
                {selectedCategory}
              </span>
            )}
          </div>

          <div className="input-controls-right">
            <span className="enter-hint">
              Enter ↵
            </span>

            <button
              type="button"
              className={`send-button ${input.trim() && !isLoading ? 'ready' : ''}`}
              onClick={onSend}
              disabled={!input.trim() || isLoading}
              title="Send question to IP-SAKTI Sahayak"
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
