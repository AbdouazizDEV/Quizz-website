import { useEffect, useRef, type RefObject } from 'react';

export interface HomeInsightItem {
  id: string;
  title: string;
  body: string;
  tag: string;
  gradient: readonly [string, string];
}

interface HomeInsightCarouselProps {
  insights: HomeInsightItem[];
  activeIndex: number;
  onChangeIndex: (index: number) => void;
  carouselRef: RefObject<HTMLDivElement | null>;
}

export function HomeInsightCarousel({
  insights,
  activeIndex,
  onChangeIndex,
  carouselRef,
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

  return (
    <div>
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
            <h3 className="home-insight-title">{item.title}</h3>
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
