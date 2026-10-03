import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const scrollToTop = () => {
      // Reset window and document root
      window.scrollTo(0, 0);
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }

      // Reset scroll for all <main>, <section> and other scroll containers
      const scrollableElements = document.querySelectorAll(
        "main, section, [class*='overflow-auto'], [class*='overflow-y-auto'], [class*='overflow-scroll']"
      );
      scrollableElements.forEach((el) => {
        el.scrollTop = 0;
        el.scrollLeft = 0;
      });
    };

    // Execute immediately
    scrollToTop();

    // Schedule frames to capture deferred/async renders
    const rafId = requestAnimationFrame(scrollToTop);
    const timeoutId = setTimeout(scrollToTop, 0);
    const timeoutIdLong = setTimeout(scrollToTop, 100);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      clearTimeout(timeoutIdLong);
    };
  }, [pathname]);

  return null;
}
