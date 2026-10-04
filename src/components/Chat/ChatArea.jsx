import React, { useRef, useEffect, useState } from 'react';
import EmptyState from '../chat/EmptyState';
import ChatMessage from '../chat/ChatMessage';
import AIProcessingAnimation from '../processing/AIProcessingAnimation';
import ErrorBanner from './ErrorBanner';
import SourcePreviewModal from './SourcePreviewModal';
import ChatInput from '../Input/ChatInput';
import UploadModal from '../upload/UploadModal';
import './ChatArea.css';

export default function ChatArea({
  messages,
  input,
  setInput,
  onSend,
  isLoading,
  error,
  onRetry,
  onSwitchToMock,
  language,
  setLanguage,
  selectedCategory,
  onSelectPrompt,
  uploadModalOpen,
  setUploadModalOpen
}) {
  const [previewCitation, setPreviewCitation] = useState(null);
  const scrollContainerRef = useRef(null);

  // Auto-scroll to bottom as messages arrive or processing starts
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  // Transform citation into preview format for SourcePreviewModal if needed
  const previewSourceAdapter = previewCitation ? {
    index: previewCitation.citation_id,
    title: previewCitation.document_title,
    page: previewCitation.page_number,
    section: previewCitation.section,
    excerpt: previewCitation.snippet,
    url: previewCitation.source_url,
    isMock: previewCitation.is_sample_document
  } : null;

  return (
    <main className="chat-main-layout">
      {/* Scrollable conversation container */}
      <div className="chat-scroll-container" ref={scrollContainerRef}>
        <div className="chat-inner-content">
          {messages.length === 0 ? (
            <EmptyState onSelectPrompt={onSelectPrompt} />
          ) : (
            <div className="messages-stream">
              {messages.map((msg, index) => (
                <ChatMessage
                  key={msg.id || index}
                  message={msg}
                  onPreviewCitation={(cit) => setPreviewCitation(cit)}
                  onRetry={msg.role === 'assistant' && index === messages.length - 1 ? onRetry : null}
                />
              ))}

              {/* AI Processing Animation when waiting for response */}
              {isLoading && (
                <AIProcessingAnimation
                  visible={isLoading}
                  primaryColor="var(--accent-blue)"
                />
              )}

              {/* Error Banner if request failed */}
              {error && (
                <ErrorBanner
                  error={error}
                  onRetry={onRetry}
                  onSwitchToMock={onSwitchToMock}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Persistent Bottom Chat Input Area */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={onSend}
        isLoading={isLoading}
        language={language}
        setLanguage={setLanguage}
        onOpenUpload={() => setUploadModalOpen(true)}
        selectedCategory={selectedCategory}
      />

      {/* Citation Inspection Preview Modal */}
      {previewCitation && (
        <SourcePreviewModal
          source={previewSourceAdapter}
          onClose={() => setPreviewCitation(null)}
        />
      )}

      {/* Document Ingestion Info Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </main>
  );
}
