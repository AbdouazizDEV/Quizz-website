interface DuelViewAllLinkProps {
  totalCount: number;
  visibleCount: number;
  onPress: () => void;
}

export function DuelViewAllLink({ totalCount, visibleCount, onPress }: DuelViewAllLinkProps) {
  if (totalCount <= visibleCount) return null;

  return (
    <button
      type="button"
      className="duel-view-all"
      onClick={onPress}
      aria-label={`Voir tout (${totalCount})`}
    >
      Voir tout ({totalCount}) →
    </button>
  );
}
