import { useEffect, useRef, type RefObject } from 'react';

export interface HomeInsightItem {
  id: string;
  body: string;
  tag: string;
  gradient: readonly [string, string];
}

interface HomeInsightCarouselProps {
  insights: HomeInsightItem[];
  activeIndex: number;
  onChangeIndex: (index: number) => void;
  carouselRef: RefObject<HTMLDivElement | null>;
  loading?: boolean;
}

export function HomeInsightCarousel({
  insights,
  activeIndex,
  onChangeIndex,
  carouselRef,
  loading = false,
}: HomeInsightCarouselProps) {
  const ignoreScroll = useRef(false);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    ignoreScroll.current = true;
    el.scrollTo({ left: activeIndex * el.clientWidth, behavior: 'smooth' });
    const t = window.setTimeout(() => {
      ignoreScroll.current = false;
    }, 420);
    return () => window.clearTimeout(t);
  }, [activeIndex, carouselRef]);

  if (loading) {
    return (
      <div className="home-insight-carousel home-insight-carousel--loading">
        <div className="home-insight-loading" aria-busy="true" />
      </div>
    );
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="home-insight-carousel">
      <div
        ref={carouselRef}
        className="home-insight-track"
        onScroll={(event) => {
          if (ignoreScroll.current) return;
          const target = event.currentTarget;
          const idx = Math.round(target.scrollLeft / Math.max(1, target.clientWidth));
          onChangeIndex(Math.max(0, Math.min(idx, insights.length - 1)));
        }}
      >
        {insights.map((item) => (
          <article
            key={item.id}
            className="home-insight-card"
            style={{ background: `linear-gradient(180deg, ${item.gradient[0]}, ${item.gradient[1]})` }}
          >
            <span className="home-insight-tag">{item.tag}</span>
            <p className="home-insight-body">{item.body}</p>
          </article>
        ))}
      </div>
      <div className="home-dots">
        {insights.map((item, idx) => (
          <span key={item.id} className={idx === activeIndex ? 'home-dot is-active' : 'home-dot'} />
        ))}
      </div>
    </div>
  );
}
