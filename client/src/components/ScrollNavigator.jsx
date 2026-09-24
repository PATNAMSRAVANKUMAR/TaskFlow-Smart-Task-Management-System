import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ChevronsDown,
  Play,
  Pause,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import {
  scrollDown,
  scrollUp,
  scrollToTop,
  scrollToBottom,
  getScrollMetrics
} from '../utils/scrollHelper';

const ScrollNavigator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const autoScrollTimerRef = useRef(null);

  // Stop auto scroll
  const stopAutoScroll = useCallback(() => {
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
    setIsAutoScrolling(false);
  }, []);

  // Update scroll metrics
  const updateScrollState = useCallback(() => {
    const { scrollTop, maxScroll, canScrollDown, canScrollUp, progress } = getScrollMetrics();

    setIsScrollable(maxScroll > 15);
    setCanScrollUp(canScrollUp);
    setCanScrollDown(canScrollDown);
    setScrollProgress(progress);

    // Stop auto-scroll if reached bottom
    if (scrollTop >= maxScroll - 5 && isAutoScrolling) {
      stopAutoScroll();
    }
  }, [isAutoScrolling, stopAutoScroll]);

  // Window listeners & periodic check
  useEffect(() => {
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState, { passive: true });

    // Periodic check in case async tasks or DOM changes alter height
    const interval = setInterval(updateScrollState, 800);

    return () => {
      window.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
      clearInterval(interval);
    };
  }, [updateScrollState]);

  // Scroll Down Step ("Down by Down")
  const handleScrollDownStep = () => {
    scrollDown();
  };

  // Scroll Up Step
  const handleScrollUpStep = () => {
    scrollUp();
  };

  // Scroll to Bottom
  const handleScrollToBottom = () => {
    scrollToBottom();
  };

  // Scroll to Top
  const handleScrollToTop = () => {
    scrollToTop();
  };

  // Start continuous smooth auto-scroll down hands-free
  const startAutoScroll = () => {
    stopAutoScroll();
    setIsAutoScrolling(true);
    autoScrollTimerRef.current = setInterval(() => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
      const clientHeight = window.innerHeight || 0;
      const maxScroll = scrollHeight - clientHeight;

      if (scrollTop >= maxScroll - 5) {
        stopAutoScroll();
      } else {
        window.scrollBy({ top: 2, behavior: 'auto' });
      }
    }, 24);
  };

  const toggleAutoScroll = () => {
    if (isAutoScrolling) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
  };

  // Stop auto-scroll on user manual wheel interaction
  useEffect(() => {
    const handleWheel = () => {
      if (isAutoScrolling) {
        stopAutoScroll();
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      stopAutoScroll();
    };
  }, [isAutoScrolling, stopAutoScroll]);

  // Keyboard shortcut listener (Shift+Down to step down, Shift+Up to step up)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is currently typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      if (e.shiftKey && e.key === 'ArrowDown') {
        e.preventDefault();
        handleScrollDownStep();
      } else if (e.shiftKey && e.key === 'ArrowUp') {
        e.preventDefault();
        handleScrollUpStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isScrollable) {
    return null;
  }

  return (
    <div
      className="fixed bottom-20 right-6 z-40 flex flex-col items-end select-none animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Scroll Control Dock */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/10 rounded-2xl transition-all duration-300">
        
        {/* Scroll To Top Button (shown when user scrolled down) */}
        {canScrollUp && (
          <button
            type="button"
            onClick={handleScrollToTop}
            title="Scroll to Top (Return to Top)"
            className="p-2 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95"
            aria-label="Scroll to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        {/* Primary Action: View Down Step-by-Step ("Down by Down") */}
        <button
          type="button"
          onClick={handleScrollDownStep}
          disabled={!canScrollDown}
          title="Scroll Down (View down step-by-step)"
          className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-md shadow-brand-500/25 active:scale-95 transition-all text-xs font-bold"
          aria-label="Scroll Down by Step"
        >
          <ChevronDown className="w-4 h-4 stroke-[2.5] animate-bounce" />
          <span>View Down</span>
          <span className="text-[10px] font-semibold bg-white/20 px-1.5 py-0.5 rounded-full">
            {scrollProgress}%
          </span>
        </button>

        {/* Scroll To Bottom Button */}
        {canScrollDown && (
          <button
            type="button"
            onClick={handleScrollToBottom}
            title="Scroll to Bottom"
            className="p-2 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95"
            aria-label="Scroll to Bottom"
          >
            <ChevronsDown className="w-4 h-4" />
          </button>
        )}

        {/* Hands-free Auto-Scroll Toggle */}
        <button
          type="button"
          onClick={toggleAutoScroll}
          title={isAutoScrolling ? "Pause Auto-Scroll" : "Auto-Scroll Down (Hands-free viewing)"}
          className={`p-2 rounded-xl transition-all active:scale-95 ${
            isAutoScrolling
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
              : 'text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          aria-label={isAutoScrolling ? "Pause Auto-Scroll" : "Start Auto-Scroll"}
        >
          {isAutoScrolling ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>

      {/* Subtle tooltip / shortcut hint on hover */}
      {isHovered && (
        <div className="mt-1.5 px-2.5 py-1 bg-slate-900/90 text-white dark:bg-slate-800/90 dark:text-slate-200 text-[11px] rounded-lg shadow-sm backdrop-blur-sm transition-all pointer-events-none">
          Click <span className="font-semibold text-brand-400">View Down</span> to step down &bull; Shift+↓
        </div>
      )}
    </div>
  );
};

export default ScrollNavigator;
