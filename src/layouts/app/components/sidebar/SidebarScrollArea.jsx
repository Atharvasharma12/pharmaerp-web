import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

/**
 * WhatsApp-style Auto-Hiding Scroll Area:
 * - Hidden on resting and hover.
 * - Shows a tiny, short 24px floating scroll pill ONLY while actively scrolling.
 * - Fades away smoothly 800ms after scrolling stops.
 */
const SidebarScrollArea = ({ children, className, containerClassName }) => {
  const containerRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [thumb, setThumb] = useState({ height: 0, top: 0, visible: false });
  const timerRef = useRef(null);

  const updateThumb = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { clientHeight, scrollHeight, scrollTop } = el;

    if (scrollHeight <= clientHeight + 2) {
      setThumb({ height: 0, top: 0, visible: false });
      return;
    }

    // Very short, compact pill (fixed 24px height like in WhatsApp / Telegram)
    const thumbHeight = 24;
    const maxScroll = scrollHeight - clientHeight;
    const thumbTop = maxScroll > 0 ? (scrollTop / maxScroll) * (clientHeight - thumbHeight) : 0;

    setThumb({ height: thumbHeight, top: thumbTop, visible: true });
  }, []);

  const handleScroll = () => {
    updateThumb();
    setIsScrolling(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 800);
  };

  useEffect(() => {
    updateThumb();
    const observer = new ResizeObserver(() => updateThumb());
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    window.addEventListener("resize", updateThumb);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateThumb);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [updateThumb, children]);

  return (
    <div className={cn("relative flex-1 min-h-0 overflow-hidden", containerClassName)}>
      {/* Scrollable Container with native scrollbar completely hidden */}
      <div
        ref={containerRef}
        data-preserve-scroll="true"
        onScroll={handleScroll}
        className={cn(
          "h-full w-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          className
        )}
      >
        {children}
      </div>

      {/* Floating Mini 24px Scrollbar Pill */}
      {thumb.visible && (
        <div
          style={{
            height: `${thumb.height}px`,
            transform: `translateY(${thumb.top}px)`,
          }}
          className={cn(
            "pointer-events-none absolute right-1 top-0 w-[3px] rounded-full bg-text-muted/70 transition-opacity duration-300",
            isScrolling ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </div>
  );
};

export default SidebarScrollArea;
