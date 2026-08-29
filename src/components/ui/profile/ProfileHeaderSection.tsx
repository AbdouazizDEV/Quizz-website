import type { ProfileStatItem, ProfileUserIdentity, ViewerRelationship } from '@app-types/profile.types';
import { Icon } from '@components/ui/Icon';

interface ProfileHeaderSectionProps {
  identity: ProfileUserIdentity;
  stats: ProfileStatItem[];
  isSelf: boolean;
  followBusy?: boolean;
  onPressCover: () => void;
  onPressAvatar: () => void;
  onPressIdentityCta: () => void;
}

function ctaLabel(relationship: ViewerRelationship, gender: ProfileUserIdentity['gender']): string {
  if (relationship === 'self') return 'modifier le profil';
  if (relationship === 'pending') return 'En attente';
  if (relationship === 'friends') return gender === 'female' ? 'Amie' : 'Ami';
  return 'Suivre';
}

export function ProfileHeaderSection({
  identity,
  stats,
  isSelf,
  followBusy,
  onPressCover,
  onPressAvatar,
  onPressIdentityCta,
}: ProfileHeaderSectionProps) {
  const disabled =
    !isSelf && (identity.viewerRelationship === 'pending' || identity.viewerRelationship === 'friends');

  return (
    <div className="profile-stage">
      <button
        type="button"
        className="profile-cover"
        onClick={isSelf ? onPressCover : undefined}
        disabled={!isSelf}
        aria-label={isSelf ? 'Changer la photo de couverture' : 'Couverture'}
      >
        <img src={identity.coverUri} alt="" />
        {isSelf ? (
          <span className="profile-cover-edit">
            <Icon name="camera" size={16} color="#FFFFFF" />
          </span>
        ) : null}
      </button>
      <div className="profile-header">
        <button
          type="button"
          className="profile-avatar-wrap"
          onClick={isSelf ? onPressAvatar : undefined}
          disabled={!isSelf}
          aria-label={isSelf ? 'Changer l’avatar' : identity.displayName}
        >
          <img src={identity.avatarUri} alt="" />
        </button>
        <div className="profile-identity">
          <div>
            <h2 className="profile-name">{identity.displayName}</h2>
            <p className="profile-handle">{identity.handle}</p>
          </div>
          <button
            type="button"
            className="profile-follow"
            disabled={disabled || followBusy}
            onClick={onPressIdentityCta}
          >
            {ctaLabel(isSelf ? 'self' : identity.viewerRelationship, identity.gender)}
          </button>
        </div>
        <div className="profile-stats">
          {stats.map((stat) => (
            <div key={stat.id} className="profile-stat">
              <b>{stat.valueLabel}</b>
              <span>{stat.caption}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
