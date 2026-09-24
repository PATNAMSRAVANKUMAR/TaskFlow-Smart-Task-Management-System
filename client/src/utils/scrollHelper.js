/**
 * Robust cross-browser scroll utilities for TaskFlow.
 * Handles window, document.scrollingElement, documentElement, and body scrollers
 * to guarantee that 'View Down' and 'View Up' step-by-step scrolling works reliably
 * on all browsers, resolutions, and operating systems.
 */

export const getScrollMetrics = () => {
  const scrollTop =
    window.scrollY ||
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    (document.scrollingElement ? document.scrollingElement.scrollTop : 0) ||
    0;

  const scrollHeight = Math.max(
    document.documentElement ? document.documentElement.scrollHeight : 0,
    document.body ? document.body.scrollHeight : 0,
    document.scrollingElement ? document.scrollingElement.scrollHeight : 0
  );

  const clientHeight =
    window.innerHeight ||
    (document.documentElement ? document.documentElement.clientHeight : 0) ||
    (document.scrollingElement ? document.scrollingElement.clientHeight : 0) ||
    0;

  const maxScroll = Math.max(0, scrollHeight - clientHeight);
  const canScrollDown = maxScroll > 15 && scrollTop < maxScroll - 15;
  const canScrollUp = scrollTop > 25;
  const progress = maxScroll > 0 ? Math.min(100, Math.max(0, Math.round((scrollTop / maxScroll) * 100))) : 0;

  return {
    scrollTop,
    scrollHeight,
    clientHeight,
    maxScroll,
    canScrollDown,
    canScrollUp,
    progress
  };
};

/**
 * Universal scroll down step ("Down by Down")
 * If already at or very near bottom, cycles smoothly back to top.
 */
export const scrollDown = (customStep) => {
  const { scrollTop, maxScroll, canScrollDown, clientHeight } = getScrollMetrics();

  // If already at or near bottom (within 20px), loop back to top
  if (!canScrollDown && maxScroll > 20) {
    scrollToTop();
    return;
  }

  // If at very top (<60px) and there's a tasks section, scroll directly to it
  if (scrollTop < 60) {
    const section =
      document.getElementById('tasks-section') ||
      document.getElementById('all-tasks-list') ||
      document.getElementById('main-content-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
  }

  // Step calculation: 70% of viewport or custom step
  const step = customStep || Math.max(300, Math.round((clientHeight || 700) * 0.7));
  const target = maxScroll > 0 ? Math.min(scrollTop + step, maxScroll) : scrollTop + step;

  applyScroll(target);
};

/**
 * Universal scroll up step
 */
export const scrollUp = (customStep) => {
  const { scrollTop, clientHeight } = getScrollMetrics();
  const step = customStep || Math.max(300, Math.round((clientHeight || 700) * 0.7));
  const target = Math.max(0, scrollTop - step);
  applyScroll(target);
};

/**
 * Scroll directly to top
 */
export const scrollToTop = () => {
  applyScroll(0);
};

/**
 * Scroll directly to bottom
 */
export const scrollToBottom = () => {
  const { maxScroll, scrollHeight } = getScrollMetrics();
  applyScroll(maxScroll > 0 ? maxScroll : scrollHeight);
};

/**
 * Executes the scroll with bulletproof fallbacks across all possible scrollers
 */
const applyScroll = (target) => {
  // 1. Try modern window.scrollTo with smooth behavior
  try {
    window.scrollTo({
      top: target,
      left: 0,
      behavior: 'smooth'
    });
  } catch {
    window.scrollTo(0, target);
  }

  // 2. Target document.scrollingElement if supported
  if (document.scrollingElement && typeof document.scrollingElement.scrollTo === 'function') {
    try {
      document.scrollingElement.scrollTo({
        top: target,
        left: 0,
        behavior: 'smooth'
      });
    } catch {
      document.scrollingElement.scrollTop = target;
    }
  }

  // 3. Directly set documentElement and body scrollTop
  if (document.documentElement) {
    try {
      document.documentElement.scrollTo({
        top: target,
        left: 0,
        behavior: 'smooth'
      });
    } catch {
      document.documentElement.scrollTop = target;
    }
  }

  if (document.body && document.body !== document.documentElement) {
    document.body.scrollTop = target;
  }
};
