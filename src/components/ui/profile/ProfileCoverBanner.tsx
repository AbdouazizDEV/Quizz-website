import { Icon } from '@components/ui/Icon';

interface ProfileCoverBannerProps {
  coverUri: string;
  editable?: boolean;
  onPressChangeCover: () => void;
}

export function ProfileCoverBanner({
  coverUri,
  editable = true,
  onPressChangeCover,
}: ProfileCoverBannerProps) {
  return (
    <div className="profile-cover-banner">
      <img src={coverUri} alt="" />
      {editable ? (
        <button
          type="button"
          className="profile-cover-edit"
          aria-label="Modifier la photo de couverture"
          onClick={onPressChangeCover}
        >
          <Icon name="camera" size={20} color="#FFFFFF" />
        </button>
      ) : null}
    </div>
  );
}
