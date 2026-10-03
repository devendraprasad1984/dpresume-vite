import {useEffect} from "react";

const SELECTOR = ".reveal";
const FLAG = "revealed";

/**
 * Reveals every `.reveal` element once it scrolls into view.
 *
 * Mounted once from App so components only need the `reveal` class (plus an
 * optional `--stagger` custom property) to opt in. A MutationObserver picks up
 * nodes added by route changes.
 *
 * The visible state is stored in `data-revealed` rather than a class: React
 * rewrites `className` wholesale on re-render, which would silently drop an
 * imperatively added class and leave the element stuck at opacity 0.
 */
const useReveal = () => {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      document
        .querySelectorAll(SELECTOR)
        .forEach((node) => (node.dataset[FLAG] = "true"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.dataset[FLAG] = "true";
          observer.unobserve(entry.target);
        });
      },
      {rootMargin: "0px 0px -8% 0px", threshold: 0.08}
    );

    const observeAll = () => {
      document.querySelectorAll(SELECTOR).forEach((node) => {
        if (node.dataset[FLAG]) return;
        observer.observe(node);
      });
    };

    observeAll();

    const mutationObserver = new MutationObserver(observeAll);
    mutationObserver.observe(document.body, {childList: true, subtree: true});

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
};

export default useReveal;
