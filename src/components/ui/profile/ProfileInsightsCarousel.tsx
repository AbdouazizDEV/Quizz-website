import { useRef } from 'react';

import type { HomeInsightItem } from '@components/ui/home/HomeInsightCarousel';

interface ProfileInsightsCarouselProps {
  insights: HomeInsightItem[];
}

export function ProfileInsightsCarousel({ insights }: ProfileInsightsCarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  if (insights.length === 0) return null;

  return (
    <div className="profile-insight-track" ref={trackRef}>
      {insights.map((item) => (
        <article
          key={item.id}
          className="profile-insight"
          style={{ background: `linear-gradient(180deg, ${item.gradient[0]}, ${item.gradient[1]})` }}
        >
          <span className="home-insight-tag">{item.tag}</span>
          <h3 className="home-insight-title">{item.title}</h3>
          <p className="home-insight-body">{item.body}</p>
        </article>
      ))}
    </div>
  );
}
