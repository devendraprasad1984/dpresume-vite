import {useEffect} from "react";

const SELECTOR = ".reveal";
const VISIBLE = "is-visible";

/**
 * Reveals every `.reveal` element once it scrolls into view.
 *
 * Mounted once from App so components only need the `reveal` class (plus an
 * optional `--stagger` custom property) to opt in. A MutationObserver picks up
 * nodes added by route changes.
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
        .forEach((node) => node.classList.add(VISIBLE));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(VISIBLE);
          observer.unobserve(entry.target);
        });
      },
      {rootMargin: "0px 0px -8% 0px", threshold: 0.08}
    );

    const observeAll = () => {
      document.querySelectorAll(SELECTOR).forEach((node) => {
        if (node.classList.contains(VISIBLE)) return;
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
