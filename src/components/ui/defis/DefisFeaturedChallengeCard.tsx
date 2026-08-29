import { Icon } from '@components/ui/Icon';
import { formatEndsIn } from '@utils/defis/formatDefisTime';

interface DefisFeaturedChallengeCardProps {
  id?: string | null;
  title?: string | null;
  endsAt?: string | null;
  onPress?: () => void;
}

export function DefisFeaturedChallengeCard({
  id,
  title,
  endsAt,
  onPress,
}: DefisFeaturedChallengeCardProps) {
  const empty = !id;
  return (
    <button
      type="button"
      className={`defis-featured defis-fade defis-fade-d2${empty ? ' is-empty' : ''}`}
      onClick={() => {
        if (id) onPress?.();
      }}
      disabled={empty}
    >
      <span className="defis-featured-kicker">
        <span className="defis-featured-award">
          <Icon name="flag" size={16} color="#1A1A2E" />
        </span>
        Challenge de la semaine
      </span>
      <h2 className="defis-featured-title">{empty ? 'Aucun challenge cette semaine' : title}</h2>
      {!empty ? <p className="defis-featured-meta">{formatEndsIn(endsAt)}</p> : null}
      <p className="defis-featured-hint">
        {empty ? 'Revenez bientôt pour un nouveau défi hebdo.' : 'Récompenses à gagner'}
      </p>
    </button>
  );
}
