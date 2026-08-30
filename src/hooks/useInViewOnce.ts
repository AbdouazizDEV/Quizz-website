import { useEffect, useRef, useState } from 'react';

/** Ajoute une classe « visible » une seule fois quand l’élément entre dans le viewport. */
export function useInViewOnce<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.18, ...options },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options, visible]);

  return { ref, visible };
}
