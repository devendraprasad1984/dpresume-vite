import {useEffect} from "react";

/**
 * Publishes the right rail's measured height as --dp-rail-h on <html>.
 *
 * The read-along sidebar in modern.css pins the rail via a negative sticky
 * `top` offset -- calc(100vh - railHeight). CSS cannot derive that on its own
 * because a percentage in `top` resolves against the containing block, not the
 * element, so the height has to be measured and handed back to CSS.
 *
 * Falls back safely: while the variable is unset the CSS min() picks the plain
 * top offset, which degrades to an ordinary top-pinned sidebar.
 */
const useRailHeight = () => {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const publish = (height) => {
      if (height > 0) root.style.setProperty("--dp-rail-h", `${Math.round(height)}px`);
    };

    const measure = () => {
      cancelAnimationFrame(frame);
      // Wait a frame so the value reflects post-layout height, not a stale one.
      frame = requestAnimationFrame(() => {
        const rail = document.querySelector(".main-right");
        if (rail) publish(rail.getBoundingClientRect().height);
      });
    };

    measure();

    const rail = document.querySelector(".main-right");
    // ResizeObserver catches font loads, card expansion and viewport changes;
    // MutationObserver catches the rail being swapped in on a route change.
    const resizeObserver = new ResizeObserver(measure);
    if (rail) resizeObserver.observe(rail);

    const mutationObserver = new MutationObserver(() => {
      const next = document.querySelector(".main-right");
      if (next && next !== rail) {
        resizeObserver.disconnect();
        resizeObserver.observe(next);
      }
      measure();
    });
    mutationObserver.observe(document.body, {childList: true, subtree: true});

    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", measure);
      root.style.removeProperty("--dp-rail-h");
    };
  }, []);
};

export default useRailHeight;
