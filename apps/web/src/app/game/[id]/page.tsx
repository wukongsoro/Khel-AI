'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import useHandleStreamResponse from '@/utils/useHandleStreamResponse';
import {
  Gamepad2,
  Send,
  RefreshCw,
  ChevronDown,
  Code2,
  Play,
  ArrowLeft,
  Loader2,
  User,
  Sparkles,
  MoreHorizontal,
} from 'lucide-react';

interface Message {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface Game {
  id: string;
  title: string;
  game_code: string;
  prompt: string;
}

type TabType = 'game' | 'code';

const renderMessageContent = (content: string) => {
  if (!content) return null;
  const parts = content.split(/(```html[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith('```html') && part.endsWith('```')) {
      const code = part.slice(7, -3).trim();
      return (
        <div key={i} className="my-2 border border-[#E5E0D8] rounded-lg overflow-hidden bg-[#FBF9F6]">
          <div className="flex items-center justify-between px-2 py-1 bg-[#F5F2EC]/50 border-b border-[#E5E0D8] text-[9px] text-[#6E6D6A]">
            <span className="font-mono font-bold">HTML Game Code</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                void navigator.clipboard.writeText(code);
              }}
              className="px-1.5 py-0.5 rounded bg-white hover:border-[#191919] border border-[#E5E0D8] text-[#191919] transition-colors cursor-pointer text-[9px] font-semibold"
            >
              Copy
            </button>
          </div>
          <pre className="p-2 text-[10px] font-mono whitespace-pre-wrap break-all text-[#2E2E2D] max-h-[180px] overflow-y-auto bg-white leading-normal">
            {code}
          </pre>
        </div>
      );
    }
    
    const trimmed = part.trim();
    if (trimmed.startsWith('<!DOCTYPE html>') || trimmed.startsWith('<html')) {
      return (
        <div key={i} className="my-2 border border-[#E5E0D8] rounded-lg overflow-hidden bg-[#FBF9F6]">
          <div className="flex items-center justify-between px-2 py-1 bg-[#F5F2EC]/50 border-b border-[#E5E0D8] text-[9px] text-[#6E6D6A]">
            <span className="font-mono font-bold">HTML Game Code</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                void navigator.clipboard.writeText(trimmed);
              }}
              className="px-1.5 py-0.5 rounded bg-white hover:border-[#191919] border border-[#E5E0D8] text-[#191919] transition-colors cursor-pointer text-[9px] font-semibold"
            >
              Copy
            </button>
          </div>
          <pre className="p-2 text-[10px] font-mono whitespace-pre-wrap break-all text-[#2E2E2D] max-h-[180px] overflow-y-auto bg-white leading-normal">
            {trimmed}
          </pre>
        </div>
      );
    }
    
    return <span key={i} className="whitespace-pre-wrap">{part}</span>;
  });
};

export default function GameEditorPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const gameId = params.id as string;
  const initialPrompt = searchParams.get('prompt') || '';

  const { data: session, isPending } = authClient.useSession();
  const [game, setGame] = useState<Game | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streamingMessage, setStreamingMessage] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('game');
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState('');
  const [iframeKey, setIframeKey] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<Message[]>([]);
  messagesRef.current = messages;

  const handleFinish = useCallback(
    (msg: string) => {
      const htmlMatch =
        msg.match(/```html\n([\s\S]*?)```/) || msg.match(/(<!DOCTYPE html>[\s\S]*)/i);
      const extractedCode = htmlMatch ? (htmlMatch[1] ?? htmlMatch[0]) : '';
      const assistantMsg: Message = { role: 'assistant', content: msg };
      setMessages((prev) => [...prev, assistantMsg]);
      setStreamingMessage('');
      setIsGenerating(false);
      if (extractedCode) {
        const cleanCode = extractedCode.trim();
        setGameCode(cleanCode);
        setIframeKey((k) => k + 1);
        void fetch(`/api/games/${gameId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ game_code: cleanCode }),
        });
        void fetch(`/api/games/${gameId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'assistant', content: msg }),
        });
      }
    },
    [gameId]
  );

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: handleFinish,
  });

  const generateGame = useCallback(
    async (userPrompt: string, currentGame?: Game) => {
      const g = currentGame ?? game;
      const userMsg: Message = { role: 'user', content: userPrompt };
      setMessages((prev) => [...prev, userMsg]);
      setIsGenerating(true);
      setInput('');
      void fetch(`/api/games/${gameId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'user', content: userPrompt }),
      });

      const systemPrompt = `You are an expert HTML5 game developer AI. Generate complete, self-contained, playable browser games.
RULES:
- Output ONLY valid HTML with inline CSS and JavaScript — start directly with <!DOCTYPE html>
- The game must be visually stunning with a dark/neon theme
- Include: game title overlay, score display, clear controls hint
- Make controls work with keyboard (arrow keys / WASD / space) AND mouse/touch
- Use a proper game loop with requestAnimationFrame
- Handle game over state with a restart option
- Canvas/container should fill the full viewport
- Use bright neon colors on dark backgrounds
- Respond with ONLY the HTML, no markdown, no explanation
Current game: "${g?.title ?? userPrompt}"`;

      const conversationMessages = [
        { role: 'system' as const, content: systemPrompt },
        ...messagesRef.current.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user' as const, content: userPrompt },
      ];

      try {
        const res = await fetch('/integrations/chat-gpt/conversationgpt4', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: conversationMessages, stream: true }),
        });
        handleStreamResponse(res);
      } catch (err) {
        console.error(err);
        setIsGenerating(false);
      }
    },
    [game, gameId, handleStreamResponse]
  );

  const loadGame = useCallback(async () => {
    try {
      const [gameRes, msgRes] = await Promise.all([
        fetch(`/api/games/${gameId}`),
        fetch(`/api/games/${gameId}/messages`),
      ]);
      if (!gameRes.ok) {
        router.push('/dashboard');
        return;
      }
      const { game: g } = (await gameRes.json()) as { game: Game };
      const { messages: msgs } = (await msgRes.json()) as { messages: Message[] };
      setGame(g);
      setTitle(g.title);
      setGameCode(g.game_code ?? '');
      setMessages(msgs ?? []);
      if (initialPrompt && (!msgs || msgs.length === 0)) {
        await generateGame(initialPrompt, g);
      }
    } catch (err) {
      console.error(err);
    }
  }, [gameId, router, initialPrompt, generateGame]);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/account/signin');
      return;
    }
    if (session?.user) {
      void loadGame();
    }
  }, [isPending, session, router, loadGame]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    void generateGame(input.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void generateGame(input.trim());
    }
  };

  async function saveTitle(newTitle: string) {
    setEditingTitle(false);
    if (!newTitle.trim() || newTitle === game?.title) return;
    await fetch(`/api/games/${gameId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    });
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  if (isPending || !game) {
    return (
      <div className="min-h-screen bg-[#FBF9F6] text-[#191919] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#C25E43]/5 border border-[#C25E43]/15 flex items-center justify-center">
            <Sparkles size={28} className="text-[#C25E43] animate-pulse" />
          </div>
          <div className="text-[#6E6D6A] text-sm font-medium">Loading game editor…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#FBF9F6] text-[#191919] overflow-hidden">
      <header className="flex-shrink-0 border-b border-[#E5E0D8] bg-white flex items-center gap-3 px-4 h-12 z-30">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-[#6E6D6A] hover:text-[#191919] transition-colors text-xs font-medium"
        >
          <ArrowLeft size={14} /> Dashboard
        </Link>
        <div className="w-px h-4 bg-[#E5E0D8]" />
        <div className="flex items-center gap-1.5">
          <Gamepad2 size={14} className="text-[#C25E43]" />
          {editingTitle ? (
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => void saveTitle(title)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void saveTitle(title);
                if (e.key === 'Escape') setEditingTitle(false);
              }}
              className="bg-transparent border-b border-[#C25E43] text-[#191919] text-sm outline-none px-1 w-48 font-medium"
            />
          ) : (
            <button
              onClick={() => setEditingTitle(true)}
              className="text-sm font-serif font-bold text-[#191919] hover:text-[#C25E43] transition-colors flex items-center gap-1 cursor-pointer"
            >
              {title}
              <ChevronDown size={12} className="text-[#6E6D6A]" />
            </button>
          )}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-0.5 rounded-lg border border-[#E5E0D8] bg-[#F5F2EC]/40 p-0.5">
          <button
            onClick={() => setActiveTab('game')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'game'
                ? 'bg-white text-[#191919] border border-[#E5E0D8]/60 shadow-xs'
                : 'text-[#6E6D6A] hover:text-[#191919]'
            }`}
          >
            <Play size={11} /> Game
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'bg-white text-[#191919] border border-[#E5E0D8]/60 shadow-xs'
                : 'text-[#6E6D6A] hover:text-[#191919]'
            }`}
          >
            <Code2 size={11} /> Code
          </button>
        </div>
        <button
          onClick={() => setIframeKey((k) => k + 1)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E5E0D8] text-xs text-[#6E6D6A] hover:text-[#191919] hover:border-[#191919] bg-white transition-colors cursor-pointer"
        >
          <RefreshCw size={11} /> Refresh
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[340px] flex-shrink-0 flex flex-col border-r border-[#E5E0D8] bg-[#F5F2EC]/20">
          <div className="flex-shrink-0 px-4 py-3 border-b border-[#E5E0D8] flex items-center justify-between bg-white/40">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[#C25E43]/10 border border-[#C25E43]/20 flex items-center justify-center">
                <Sparkles size={10} className="text-[#C25E43]" />
              </div>
              <span className="text-xs font-bold text-[#191919]">Khel AI Assistant</span>
            </div>
            <button className="text-[#6E6D6A] hover:text-[#191919] transition-colors cursor-pointer">
              <MoreHorizontal size={15} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !streamingMessage && !isGenerating && (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="w-12 h-12 rounded-xl bg-[#C25E43]/5 border border-[#C25E43]/15 flex items-center justify-center mb-4">
                  <Gamepad2 size={22} className="text-[#C25E43]" />
                </div>
                <p className="text-sm font-serif font-bold text-[#191919] mb-1">Describe your game</p>
                <p className="text-xs text-[#6E6D6A] max-w-[220px]">
                  Tell me what game to build. I&apos;ll generate the code and show a live preview.
                </p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    msg.role === 'user'
                      ? 'bg-[#C25E43] text-white'
                      : 'border border-[#E5E0D8] bg-white text-[#C25E43]'
                  }`}
                >
                  {msg.role === 'user' ? <User size={12} /> : <Sparkles size={10} />}
                </div>
                <div
                  className={`max-w-[275px] rounded-xl px-3 py-2.5 text-xs leading-relaxed shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-white border border-[#C25E43]/20 text-[#191919] rounded-tr-xs'
                      : 'bg-white border border-[#E5E0D8] text-[#191919] rounded-tl-xs'
                  }`}
                >
                  {msg.role === 'assistant'
                    ? renderMessageContent(msg.content)
                    : msg.content}
                </div>
              </div>
            ))}

            {(isGenerating || streamingMessage) && (
              <div className="flex gap-2.5">
                <div className="flex-shrink-0 w-6 h-6 rounded-full border border-[#E5E0D8] bg-white flex items-center justify-center text-[#C25E43]">
                  <Loader2
                    size={10}
                    className="animate-spin text-[#C25E43]"
                  />
                </div>
                <div className="max-w-[275px] rounded-xl rounded-tl-xs px-3 py-2.5 text-xs bg-[#F5F2EC] border border-[#E5E0D8] text-[#6E6D6A] leading-relaxed w-full">
                  {streamingMessage ? (
                    renderMessageContent(streamingMessage)
                  ) : (
                    '⚡ Generating game code…'
                  )}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex-shrink-0 p-3 border-t border-[#E5E0D8] bg-white/40">
            <form onSubmit={handleSend} className="flex flex-col gap-2">
              <div className="flex items-end gap-2 rounded-xl border border-[#E5E0D8] bg-white px-3 py-2.5 focus-within:border-[#C25E43] focus-within:ring-1 focus-within:ring-[#C25E43]/30 transition-all shadow-xs">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Modify the game or describe a new one…"
                  rows={1}
                  disabled={isGenerating}
                  className="flex-1 bg-transparent text-xs text-[#191919] placeholder-gray-400 outline-none resize-none leading-relaxed"
                  style={{ minHeight: '20px', maxHeight: '120px' }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isGenerating}
                  className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#191919] flex items-center justify-center hover:bg-[#2E2E2D] disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <Send size={12} className="text-[#FBF9F6]" />
                </button>
              </div>
              <p className="text-[10px] text-[#6E6D6A] text-center">
                Enter to send · Shift+Enter for new line
              </p>
            </form>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-[#FBF9F6] overflow-hidden">
          {activeTab === 'game' ? (
            <div className="flex-1 relative bg-[#F5F2EC]/20">
              {gameCode ? (
                <iframe
                  key={iframeKey}
                  srcDoc={gameCode}
                  className="w-full h-full border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin"
                  title="Game Preview"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                  <div className="w-24 h-24 rounded-3xl bg-white border border-[#E5E0D8] flex items-center justify-center mb-6 shadow-xs">
                    <Gamepad2 size={40} className="text-[#C25E43]/20" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#191919] mb-2">Game Preview</h3>
                  <p className="text-[#6E6D6A] text-sm max-w-xs leading-relaxed">
                    {isGenerating
                      ? 'AI is building your game… takes about 15–30 seconds.'
                      : 'Describe a game in the chat to get started. Your playable game will appear here.'}
                  </p>
                  {isGenerating && (
                    <div className="mt-6 flex items-center gap-2 text-[#C25E43] text-sm font-semibold">
                      <Loader2 size={16} className="animate-spin text-[#C25E43]" />
                      <span>Generating game code…</span>
                    </div>
                  )}
                </div>
              )}
              {gameCode && (
                <button
                  onClick={() => setIframeKey((k) => k + 1)}
                  className="absolute bottom-4 right-4 w-9 h-9 rounded-xl bg-white/95 border border-[#E5E0D8] flex items-center justify-center text-[#6E6D6A] hover:text-[#191919] hover:bg-white shadow-md transition-all cursor-pointer"
                  title="Reload"
                >
                  <RefreshCw size={15} />
                </button>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-hidden flex flex-col bg-white">
              <div className="p-4 border-b border-[#E5E0D8] flex items-center justify-between bg-[#F5F2EC]/20">
                <div className="flex items-center gap-2 text-xs text-[#6E6D6A]">
                  <Code2 size={13} /> <span className="text-[#191919] font-semibold">index.html</span>
                  <span>· {gameCode.length} characters</span>
                </div>
                <button
                  onClick={() => {
                    void navigator.clipboard.writeText(gameCode);
                  }}
                  className="text-xs text-[#191919] font-medium bg-white border border-[#E5E0D8] rounded-lg px-2.5 py-1 hover:border-[#191919] transition-colors cursor-pointer"
                >
                  Copy Code
                </button>
              </div>
              <pre className="flex-1 p-6 text-xs text-[#2E2E2D] font-mono leading-relaxed overflow-auto bg-[#FBF9F6] whitespace-pre-wrap break-all border-0">
                {gameCode || 'No code generated yet. Ask the AI to build a game!'}
              </pre>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(25, 25, 25, 0.1);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
