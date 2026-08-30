import type { ConnectionUser } from '@app-types/network.types';

interface ConnectionListItemProps {
  user: ConnectionUser;
  relationshipActive: boolean;
  onToggleFollow: () => void;
  onPressAvatar?: () => void;
}

export function ConnectionListItem({
  user,
  relationshipActive,
  onToggleFollow,
  onPressAvatar,
}: ConnectionListItemProps) {
  return (
    <div className="network-row">
      <button
        type="button"
        className="network-avatar-btn"
        onClick={onPressAvatar}
        aria-label={`Voir le profil de ${user.displayName}`}
      >
        <img className="network-avatar" src={user.avatarUri} alt="" />
      </button>
      <div className="network-row-text">
        <strong className="network-row-name">{user.displayName}</strong>
        <span className="network-row-handle">{user.handle}</span>
      </div>
      <button
        type="button"
        className={relationshipActive ? 'network-action is-friend' : 'network-action is-follow'}
        aria-pressed={relationshipActive}
        aria-label={relationshipActive ? 'Ne plus suivre' : 'Suivre'}
        onClick={onToggleFollow}
      >
        {relationshipActive ? 'Ami' : 'Suivre'}
      </button>
    </div>
  );
}
