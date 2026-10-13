"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    )
      return;
    document.documentElement.classList.add("motion-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -32px 0px", threshold: 0.01 },
    );
    const observeTargets = () => {
      document
        .querySelectorAll<HTMLElement>(".reveal-on-scroll:not(.is-visible)")
        .forEach((target) => observer.observe(target));
    };
    observeTargets();
    const mutations = new MutationObserver(observeTargets);
    mutations.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["hidden"],
    });
    return () => {
      mutations.disconnect();
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);
  return null;
}
