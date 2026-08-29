interface WalkthroughPaginationProps {
  total: number;
  activeIndex: number;
}

export function WalkthroughPagination({ total, activeIndex }: WalkthroughPaginationProps) {
  return (
    <div className="walk-dots" role="tablist" aria-label="Pagination du tutoriel">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={index === activeIndex ? 'walk-dot is-active' : 'walk-dot'}
          role="tab"
          aria-selected={index === activeIndex}
        />
      ))}
    </div>
  );
}
