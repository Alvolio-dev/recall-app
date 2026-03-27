"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface FollowUpChatProps {
  transcript: string;
  title: string;
  channel: string;
}

const FREE_LIMIT = 2;

export function FollowUpChat({ transcript, title, channel }: FollowUpChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const atLimit = questionCount >= FREE_LIMIT;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || atLimit) return;

    const question = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    try {
      const res = await fetch("/api/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, transcript, title, channel }),
      });

      if (!res.ok) throw new Error("Failed to get answer");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let answer = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          answer += decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: answer };
            return updated;
          });
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I could not answer that. Please try again." },
      ]);
    } finally {
      setLoading(false);
      setQuestionCount((c) => c + 1);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
      <div className="p-4 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-zinc-500" />
          <p className="text-sm font-medium text-zinc-900">Ask a follow-up</p>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="max-h-80 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={msg.role === "user" ? "flex justify-end" : ""}
            >
              <div
                className={
                  msg.role === "user"
                    ? "bg-zinc-900 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-md max-w-[80%]"
                    : "bg-zinc-50 text-zinc-800 text-sm px-4 py-2.5 rounded-2xl rounded-bl-md max-w-[80%] leading-relaxed"
                }
              >
                {msg.content || (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />
                )}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {atLimit ? (
        <div className="p-4 border-t border-zinc-100 text-center">
          <p className="text-xs text-zinc-500 mb-2">
            You have used your {FREE_LIMIT} free follow-ups for this video.
          </p>
          <a
            href="/settings"
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Upgrade to Pro for unlimited →
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-3 border-t border-zinc-100">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this video..."
              className="flex-1 min-w-0 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-emerald-400 transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <p className="text-[10px] text-zinc-400 mt-2 text-center">
            {FREE_LIMIT - questionCount} of {FREE_LIMIT} free follow-ups remaining
          </p>
        </form>
      )}
    </div>
  );
}
