import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Minus,
  X,
  Send,
  Headphones,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  PlusCircle,
  MessageSquare
} from 'lucide-react';
import AiAssistantLogo from './AiAssistantLogo';
import { useTasks } from '../context/TaskContext';

const INITIAL_MESSAGE = {
  id: 'init-1',
  sender: 'ai',
  text: "Hi. Ask me about your tasks, schedule, productivity tips, or how to organize your workflow. To manage tasks, just tell me what to do!",
  timestamp: new Date()
};

const SUGGESTED_QUESTIONS = [
  "What tasks are due today?",
  "How do I prioritize my workload?",
  "What features does TaskFlow have?",
  "Show my productivity summary",
  "Add task: Team sync & review"
];

const AiAssistant = () => {
  const { tasks, stats, createTask } = useTasks();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll messages to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen, isTyping]);

  // Text-to-speech helper
  const speakText = (text) => {
    if (!isAudioEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      // Clean markdown stars/emojis for smoother speech
      const cleanText = text.replace(/[*_#`]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  // Smart AI Response Generator connected to actual TaskFlow state
  const generateAiResponse = async (userQuery) => {
    const q = userQuery.toLowerCase().trim();

    // 1. Add Task command
    if (q.startsWith('add task:') || q.startsWith('add task') || q.startsWith('create task:') || q.startsWith('create task')) {
      let taskTitle = userQuery.replace(/^(add task:?|create task:?)/i, '').trim();
      if (!taskTitle) taskTitle = 'New Priority Task';

      try {
        await createTask({
          title: taskTitle,
          priority: 'Medium',
          category: 'Work',
          status: 'Pending',
          dueDate: new Date().toISOString()
        });
        return `✅ I've created the task: "${taskTitle}" and set it with Medium priority for today! You can see it on your Dashboard or All Tasks view.`;
      } catch (err) {
        return `I attempted to create "${taskTitle}", but encountered an issue. Please try using the "+ Add Task" button above.`;
      }
    }

    // 2. Tasks Due Today
    if (q.includes('today') || q.includes('due today') || q.includes("today's schedule")) {
      const today = new Date();
      const todayTasks = tasks.filter((t) => {
        if (!t.dueDate) return false;
        const d = new Date(t.dueDate);
        return (
          d.getDate() === today.getDate() &&
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear()
        );
      });

      if (todayTasks.length === 0) {
        return `📅 You currently have no tasks scheduled for today. Would you like me to help you schedule one? Just type: "Add task: [title]".`;
      }

      const list = todayTasks
        .map((t, idx) => `${idx + 1}. ${t.title} [${t.priority} Priority • ${t.status}]`)
        .join('\n');
      return `📅 You have ${todayTasks.length} task${todayTasks.length > 1 ? 's' : ''} scheduled for today:\n\n${list}\n\nKeep up the great focus!`;
    }

    // 3. Overdue Tasks
    if (q.includes('overdue') || q.includes('late') || q.includes('behind')) {
      const now = new Date();
      const overdueList = tasks.filter((t) => {
        const d = t.dueDate ? new Date(t.dueDate) : null;
        return d && d < now && t.status !== 'Completed';
      });

      if (overdueList.length === 0) {
        return `✨ Fantastic job! You have zero overdue tasks. You're completely on schedule!`;
      }

      const list = overdueList.map((t, i) => `${i + 1}. ${t.title} (Due: ${new Date(t.dueDate).toLocaleDateString()})`).join('\n');
      return `⚠️ You have ${overdueList.length} overdue task${overdueList.length > 1 ? 's' : ''} requiring attention:\n\n${list}\n\nI recommend tackling the most urgent item first!`;
    }

    // 4. Productivity Summary & Score
    if (q.includes('summary') || q.includes('stats') || q.includes('score') || q.includes('progress') || q.includes('productivity')) {
      return `📊 Here is your current productivity pulse:\n\n• Total Workspace Tasks: ${stats.totalTasks}\n• Completed: ${stats.completedTasks} (${stats.progressPercentage}% completion rate)\n• In Progress: ${stats.inProgressTasks}\n• Pending: ${stats.pendingTasks}\n• Overdue: ${stats.overdueTasks}\n\n${
        stats.progressPercentage >= 70
          ? '🔥 Outstanding momentum! You are crushing your goals!'
          : '💪 Stay consistent. Focusing on 1-2 key tasks will rapidly boost your progress!'
      }`;
    }

    // 5. Prioritization Advice
    if (q.includes('prioritize') || q.includes('priority') || q.includes('overwhelmed') || q.includes('tips')) {
      return `💡 Here is a proven framework to prioritize effectively:\n\n1. **High Priority (Do First)**: Tasks with near deadlines or high business impact.\n2. **Medium Priority (Schedule)**: Important strategic goals without immediate fire.\n3. **Low Priority (Delegate/Later)**: Minor maintenance or non-urgent chores.\n\nTip: Focus on your top 3 tasks for today before taking on new ones!`;
    }

    // 6. Features & App Capabilities
    if (q.includes('feature') || q.includes('what can you do') || q.includes('template') || q.includes('help')) {
      return `🚀 TaskFlow is equipped with:\n\n• **Smart Dashboard**: Live metrics, progress rates, and instant task capture.\n• **Dynamic Views**: All Tasks, Today, Upcoming, and Completed tracking.\n• **Organization**: Custom categories, priority flags, and due date alerts.\n• **Quick Navigation**: Floating View Down scroll tools and instant search.\n• **Theme Support**: Seamless Dark and Light modes.\n\nNeed to create a task? Just tell me "Add task: [title]"!`;
    }

    // Default Fallback
    return `Got it! I'm here to assist your workflow. You can ask me to check today's tasks, report your completion rate, or add new tasks directly. How can I help you next?`;
  };

  // Handle message sending
  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Realistic brief AI thinking delay
    setTimeout(async () => {
      const responseText = await generateAiResponse(text.trim());
      const aiReply = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
      speakText(responseText);
    }, 600);
  };

  const handleResetChat = () => {
    setMessages([INITIAL_MESSAGE]);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };

  return (
    <>
      {/* 1. Collapsed Trigger Capsule Pill (Matching Screenshot 1) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in select-none">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group flex items-center space-x-3.5 pl-2.5 pr-4 py-2 bg-zinc-900/95 dark:bg-zinc-900/95 hover:bg-zinc-800 text-white rounded-full border border-zinc-700/80 shadow-2xl shadow-black/40 backdrop-blur-md transition-all duration-300 hover:scale-[1.03] active:scale-95 hover:border-cyan-500/50"
            aria-label="Open TaskFlow AI Assistant"
          >
            {/* Robot Logo with Online Green Status Indicator */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-zinc-950 flex items-center justify-center p-0.5 border border-cyan-500/30 group-hover:border-cyan-400 transition-colors shadow-sm shadow-cyan-500/20">
                <AiAssistantLogo className="w-9 h-9" />
              </div>
              {/* Online Green Dot Indicator */}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-900 shadow-sm" />
            </div>

            {/* Pill Labels */}
            <div className="text-left flex flex-col justify-center">
              <span className="text-sm font-bold text-white tracking-tight leading-tight group-hover:text-cyan-300 transition-colors">
                Need Help?
              </span>
              <span className="text-[11px] font-medium text-zinc-400 -mt-0.5 flex items-center gap-1">
                <span>TaskFlow AI</span>
                <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
              </span>
            </div>

            {/* Right Headphone / Sparkle Icon */}
            <div className="pl-1 text-zinc-400 group-hover:text-cyan-400 transition-colors">
              <Headphones className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* 2. Expanded Floating Chat Window (Matching Screenshot 2) */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex flex-col bg-zinc-950 text-white rounded-3xl border border-zinc-800 shadow-2xl shadow-black/60 overflow-hidden transition-all duration-300 animate-slide-up ${
            isExpanded
              ? 'w-[92vw] sm:w-[540px] h-[85vh] max-h-[750px]'
              : 'w-[92vw] sm:w-[410px] h-[600px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-zinc-900/90 border-b border-zinc-800/80 backdrop-blur-md">
            {/* Assistant Info */}
            <div className="flex items-center space-x-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-zinc-950 flex items-center justify-center p-0.5 border border-cyan-500/40">
                  <AiAssistantLogo className="w-8 h-8" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-zinc-900" />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white tracking-tight truncate flex items-center gap-1.5">
                  <span>TaskFlow Assistant</span>
                  <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                </h3>
                <p className="text-[11px] text-zinc-400 truncate flex items-center gap-1.5">
                  <span>About TaskFlow</span>
                  <span className="text-zinc-600">&bull;</span>
                  <span className="text-emerald-400 font-medium">Online</span>
                </p>
              </div>
            </div>

            {/* Action Buttons: History, Audio, Fullscreen, Minimize, Close */}
            <div className="flex items-center space-x-1 text-zinc-400">
              {/* Reset / History */}
              <button
                type="button"
                onClick={handleResetChat}
                title="Restart conversation"
                className="p-1.5 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Sound / TTS Toggle */}
              <button
                type="button"
                onClick={() => {
                  if (isAudioEnabled && window.speechSynthesis) window.speechSynthesis.cancel();
                  setIsAudioEnabled(!isAudioEnabled);
                }}
                title={isAudioEnabled ? "Mute audio replies" : "Enable voice replies"}
                className={`p-1.5 rounded-lg transition-colors ${
                  isAudioEnabled ? 'text-cyan-400 bg-cyan-950/40' : 'hover:text-white hover:bg-zinc-800'
                }`}
              >
                {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Expand / Minimize Window */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Standard view" : "Expand view"}
                className="hidden sm:inline-flex p-1.5 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Minimize (Close to pill) */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize assistant"
                className="p-1.5 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scroll-smooth">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isAi ? 'justify-start' : 'justify-end'} animate-fade-in`}
                >
                  {isAi && (
                    <div className="w-7 h-7 rounded-full bg-zinc-900 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <AiAssistantLogo className="w-6 h-6" hasGlow={false} />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] text-sm rounded-2xl p-4 leading-relaxed break-words whitespace-pre-line shadow-sm ${
                      isAi
                        ? 'bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-tl-sm'
                        : 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-sm shadow-brand-500/20'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {/* Typing Animation */}
            {isTyping && (
              <div className="flex items-center space-x-2 text-zinc-400 text-xs pl-9 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[11px] text-zinc-500 ml-1">TaskFlow AI is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions Section (Matching Screenshot 2) */}
          <div className="px-4 pt-2 pb-2 border-t border-zinc-900 bg-zinc-950/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-400">
                Pick a question, or message the team.
              </span>
              <button
                type="button"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="text-zinc-500 hover:text-zinc-300 p-0.5 transition-colors"
                title="Toggle suggestions"
              >
                {showSuggestions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showSuggestions && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(q)}
                    className="w-full text-left px-3.5 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 text-xs font-medium transition-all active:scale-[0.98] truncate"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Human Support / Direct Help Action (Matching Screenshot 2 bottom pill) */}
          <div className="px-4 py-1.5 bg-zinc-950">
            <button
              type="button"
              onClick={() => handleSend("Can I get human support or product help?")}
              className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 text-xs font-medium transition-colors"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Contact human support</span>
            </button>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-zinc-900/80 border-t border-zinc-800 flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask TaskFlow AI or type 'Add task: ...'"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 bg-zinc-950 text-white placeholder-zinc-500 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-zinc-700/80 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
            />

            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
              className="p-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl shadow-md shadow-brand-500/25 active:scale-95 transition-all shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistant;
