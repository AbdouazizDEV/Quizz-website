interface HomeSectionTitleProps {
  title: string;
  action?: string;
  onActionPress?: () => void;
}

export function HomeSectionTitle({ title, action, onActionPress }: HomeSectionTitleProps) {
  return (
    <div className="home-section-header">
      <h2 className="home-section-title">{title}</h2>
      {action ? (
        onActionPress ? (
          <button type="button" className="home-section-action" onClick={onActionPress}>
            {action}
          </button>
        ) : (
          <span className="home-section-action">{action}</span>
        )
      ) : null}
    </div>
  );
}
