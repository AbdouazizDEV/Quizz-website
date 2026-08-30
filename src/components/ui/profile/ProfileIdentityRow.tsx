interface ProfileIdentityRowProps {
  displayName: string;
  handle: string;
  avatarUri: string;
  actionLabel?: string;
  actionVariant?: 'primary' | 'pending' | 'friend';
  actionDisabled?: boolean;
  onEditProfile: () => void;
  onPressAvatar?: () => void;
}

export function ProfileIdentityRow({
  displayName,
  handle,
  avatarUri,
  actionLabel = 'Modifier le profil',
  actionVariant = 'primary',
  actionDisabled = false,
  onEditProfile,
  onPressAvatar,
}: ProfileIdentityRowProps) {
  return (
    <div className="profile-identity-row">
      <div className="profile-identity-left">
        {onPressAvatar ? (
          <button type="button" className="profile-identity-avatar" onClick={onPressAvatar} aria-label="Changer l’avatar">
            <img src={avatarUri} alt="" />
          </button>
        ) : (
          <span className="profile-identity-avatar is-static">
            <img src={avatarUri} alt="" />
          </span>
        )}
        <div className="profile-identity-text">
          <h2>{displayName}</h2>
          <p>{handle}</p>
        </div>
      </div>
      <button
        type="button"
        className={`profile-identity-cta is-${actionVariant}`}
        disabled={actionDisabled}
        onClick={onEditProfile}
      >
        {actionLabel}
      </button>
    </div>
  );
}
