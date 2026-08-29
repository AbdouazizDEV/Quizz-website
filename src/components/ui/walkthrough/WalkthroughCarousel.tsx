import type { WalkthroughSlide } from '@app-types/walkthrough.types';

interface WalkthroughCarouselProps {
  slides: WalkthroughSlide[];
  activeIndex: number;
  onSelect?: (index: number) => void;
}

export function WalkthroughCarousel({ slides, activeIndex }: WalkthroughCarouselProps) {
  return (
    <div className="walk-carousel">
      <div
        className="walk-track"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <article key={slide.id} className="walk-slide">
            <img src={slide.image} alt="" className="walk-image" />
            <h2 className="walk-title">{slide.title}</h2>
          </article>
        ))}
      </div>
    </div>
  );
}
