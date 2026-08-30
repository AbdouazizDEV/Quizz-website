interface SectionTitleProps {
  title: string;
}

export function SectionTitle({ title }: SectionTitleProps) {
  return (
    <h2 className="duel-section-title">{title}</h2>
  );
}
