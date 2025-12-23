'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePreferencesStore } from '@/store';

interface Citation {
  chunk_id: string;
  score: number;
  text: string;
  meta: {
    url: string;
    title: string;
    source_type: string;
    asset_class: string[];
    trust_rank: number;
    country: string;
  };
}

interface AnswerSection {
  title: string;
  bullets: string[];
}

interface Answer {
  summary: string;
  sections: AnswerSection[];
  limitations: string;
  citations: string[];
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  answer?: Answer;
  evidence?: Citation[];
  isLoading?: boolean;
}

export default function AskPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeCitations, setActiveCitations] = useState<Citation[]>([]);
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    persona,
    default_countries,
    default_asset_class_any,
    onboardingComplete,
    resetOnboarding,
  } = usePreferencesStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !onboardingComplete) {
      router.push('/');
    }
  }, [mounted, onboardingComplete, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    const payload = {
      kb_id: 'global_invest_v1',
      persona: {
        citizenship: persona.citizenship || 'India',
        residency: persona.residency || 'India',
        investor_type: persona.investor_type || 'individual',
      },
      intent: 'cross_border_real_estate',
      question: input.trim(),
      countries: default_countries.length > 0 ? default_countries : ['United States', 'India'],
      asset_class_any: default_asset_class_any.length > 0 ? default_asset_class_any : ['real_estate', 'compliance', 'tax'],
      source_type_any: ['tax_authority', 'regulator', 'statute'],
      trust_rank_lte: 5,
      limit: 10,
      output: 'json',
      strict_citations: true,
    };

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      setMessages((prev) =>
        prev.map((msg) =>
          msg.isLoading
            ? {
                ...msg,
                isLoading: false,
                content: data.answer?.summary || 'I could not find an answer to your question.',
                answer: data.answer,
                evidence: data.evidence,
              }
            : msg
        )
      );
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.isLoading
            ? {
                ...msg,
                isLoading: false,
                content: 'Sorry, something went wrong. Please try again.',
                answer: undefined,
                evidence: undefined,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openResourcesPanel = (evidence: Citation[]) => {
    setActiveCitations(evidence);
    setSelectedCitation(null);
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setSelectedCitation(null);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col font-sans text-slate-100">
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 border-b border-white/10 bg-[#0a0a0f]/90 backdrop-blur-xl flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold flex items-center gap-1">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              visa
            </span>
            <span className="text-white/90">verse</span>
          </h1>
          <button
            onClick={resetOnboarding}
            className="text-xs sm:text-sm text-white/50 hover:text-white/80 transition-colors px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-white/5"
          >
            Reset
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main 
        className={`flex-1 pt-20 sm:pt-24 pb-32 sm:pb-40 w-full flex flex-col items-center transition-all duration-300 ${
          isPanelOpen ? 'lg:mr-96' : ''
        }`}
      >
        <div className="w-full max-w-3xl px-4 sm:px-6">
          
          {/* Empty State */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh] text-center px-2 sm:px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-6 sm:mb-8 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-500/10">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
                How can I help you today?
              </h2>
              
              <p className="text-white/50 mb-8 sm:mb-12 text-base sm:text-lg leading-relaxed max-w-md">
                Ask me about cross-border investments, tax obligations, regulatory requirements, and more.
              </p>
              
              {/* Asset class tags */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
                {default_asset_class_any.map((asset) => (
                  <span
                    key={asset}
                    className="inline-flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs sm:text-sm capitalize hover:bg-white/10 transition-colors cursor-default whitespace-nowrap"
                  >
                    {asset.replace('_', ' ')}
                  </span>
                ))}
              </div>
                              
              <div className="w-full max-w-2xl space-y-3 sm:space-y-4">
                <p className="text-white/40 text-xs sm:text-sm mb-3 sm:mb-4 font-medium uppercase tracking-wider">
                  Try asking
                </p>
                <div className="grid gap-3 sm:gap-4">
                  {[
                    'What tax obligations apply to foreign real estate purchases in the US?',
                    'How can an NRI invest in Indian startups?',
                    'What are the compliance requirements for crypto investments?',
                  ].map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(question)}
                      className="text-left px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.07] hover:border-white/20 transition-all text-sm sm:text-base shadow-sm leading-relaxed"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages List */}
          <div className="space-y-6 sm:space-y-10 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[95%] sm:max-w-[90%] rounded-2xl sm:rounded-3xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-sm'
                      : 'bg-transparent'
                  }`}
                >
                  {message.isLoading ? (
                    <div className="flex items-center gap-3 py-3 sm:py-4">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                      </div>
                      <span className="text-white/50 animate-pulse text-sm sm:text-base">Searching knowledge base...</span>
                    </div>
                  ) : (
                    <>
                      {message.role === 'user' && (
                        <p className="text-white leading-relaxed whitespace-pre-wrap text-sm sm:text-base">{message.content}</p>
                      )}

                      {message.role === 'assistant' && (
                        <div className="space-y-6 sm:space-y-8">
                          <div className="flex gap-3 sm:gap-5">
                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0 pt-1">
                              <p className="text-white/90 leading-relaxed text-base sm:text-lg">{message.content}</p>
                            </div>
                          </div>

                          {message.answer?.sections && message.answer.sections.length > 0 && (
                            <div className="ml-0 sm:ml-14 space-y-4 sm:space-y-6">
                              {message.answer.sections.map((section, idx) => (
                                <div key={idx} className="bg-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/[0.04] transition-colors">
                                  <h4 className="text-white font-semibold mb-3 sm:mb-5 flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                                    <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs sm:text-sm font-bold">
                                      {idx + 1}
                                    </span>
                                    {section.title}
                                  </h4>
                                  <ul className="space-y-3 sm:space-y-4">
                                    {section.bullets.map((bullet, bIdx) => (
                                      <li key={bIdx} className="text-white/70 text-sm sm:text-base flex gap-3 sm:gap-4 leading-relaxed">
                                        <span className="text-purple-400 mt-1.5 flex-shrink-0">•</span>
                                        <span>{bullet}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}

                          {message.answer?.limitations && (
                            <div className="ml-0 sm:ml-14">
                              <p className="text-white/40 text-xs sm:text-sm italic border-l-2 border-orange-500/50 pl-3 sm:pl-4 py-2 sm:py-3 bg-orange-500/5 rounded-r-lg leading-relaxed">
                                ⚠️ {message.answer.limitations}
                              </p>
                            </div>
                          )}

                          {message.evidence && message.evidence.length > 0 && (
                            <div className="ml-0 sm:ml-14">
                              <button
                                onClick={() => openResourcesPanel(message.evidence!)}
                                className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all text-xs sm:text-sm font-medium group"
                              >
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {message.evidence.length} {message.evidence.length === 1 ? 'source' : 'sources'}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* INPUT AREA */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-10 flex justify-center transition-all duration-300 ${
          isPanelOpen ? 'lg:mr-96' : ''
        }`}
      >
        <div className="w-full bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f] to-transparent pt-6 sm:pt-12 pb-4 sm:pb-8 px-4 sm:px-6 flex justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-3xl">
            <div className="relative bg-[#0a0a0f] border border-white/10 rounded-xl sm:rounded-2xl shadow-2xl shadow-purple-900/10 focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/20 transition-all">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask about investments, taxes, regulations..."
                rows={1}
                className="w-full px-4 pr-20 sm:px-6 sm:pr-36 py-4 sm:py-5 bg-white/[0.03] text-white placeholder-white/40 focus:outline-none resize-none overflow-y-auto leading-relaxed text-sm sm:text-base rounded-xl sm:rounded-2xl"
                style={{ maxHeight: '200px' }}
              />
              
              <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 sm:gap-3">
                <span className="text-white/20 text-xs hidden md:block pointer-events-none">
                  Shift + Enter
                </span>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                    input.trim() && !isLoading
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 active:scale-95'
                      : 'bg-white/5 text-white/30 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Send'
                  )}
                </button>
              </div>
            </div>
            <p className="text-center text-white/30 text-[10px] sm:text-xs mt-3 sm:mt-4 px-4">
              Powered by verified regulatory documents and tax authority publications
            </p>
          </form>
        </div>
      </div>

      {/* Resources Panel - FIXED with proper scrolling */}
      <div
        className={`fixed top-14 sm:top-16 right-0 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-full sm:w-96 bg-[#0d0d14] border-l border-white/10 transform transition-transform duration-300 ease-in-out z-40 shadow-2xl flex flex-col ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header - fixed, won't scroll */}
        <div className="flex-shrink-0 bg-[#0d0d14]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base">Sources</h3>
            <p className="text-white/40 text-xs sm:text-sm">{activeCitations.length} documents found</p>
          </div>
          <button
            onClick={closePanel}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content - takes remaining height */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {selectedCitation ? (
            <div className="space-y-4 sm:space-y-6 pb-8">
              <button
                onClick={() => setSelectedCitation(null)}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm transition-colors group"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to all sources
              </button>

              <div className="space-y-4 sm:space-y-5">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wide mb-2">Title</p>
                  <p className="text-white font-medium leading-snug text-sm sm:text-base">{selectedCitation.meta.title}</p>
                </div>
                
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wide mb-2">Source Type</p>
                  <p className="text-white/70 text-sm capitalize">{selectedCitation.meta.source_type.replace('_', ' ')}</p>
                </div>
                
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wide mb-2">Country</p>
                  <p className="text-white/70 text-sm">{selectedCitation.meta.country}</p>
                </div>
                
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wide mb-2">Relevance</p>
                  <p className="text-white/70 text-sm">{(selectedCitation.score * 100).toFixed(0)}% match</p>
                </div>
                
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wide mb-2">Excerpt</p>
                  <p className="text-white/70 text-xs sm:text-sm leading-relaxed bg-white/[0.02] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/5">
                    {selectedCitation.text.slice(0, 600)}...
                  </p>
                </div>
                
                <a
                  href={selectedCitation.meta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 sm:py-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all text-sm sm:text-base"
                >
                  <span>View Original Document</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3 pb-8">
              {activeCitations.map((citation, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCitation(citation)}
                  className="w-full text-left p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] hover:border-white/20 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs sm:text-sm font-medium group-hover:bg-purple-500/30 transition-colors">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-xs sm:text-sm mb-1 truncate group-hover:text-purple-300 transition-colors">
                        {citation.meta.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] sm:text-xs text-white/40">
                        <span className="capitalize">{citation.meta.source_type.replace('_', ' ')}</span>
                        <span>•</span>
                        <span>{(citation.score * 100).toFixed(0)}% match</span>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-white/30 group-hover:text-purple-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isPanelOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={closePanel}
        />
      )}
    </div>
  );
}