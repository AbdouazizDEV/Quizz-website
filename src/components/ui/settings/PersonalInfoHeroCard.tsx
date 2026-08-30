import { Icon } from '@components/ui/Icon';
import type { PersonalInfoFormValues } from '@app-types/personalInfo.types';
import { getUserAvatarUri } from '@utils/getUserAvatarUri';

interface PersonalInfoHeroCardProps {
  form: PersonalInfoFormValues;
  userId: string;
}

export function PersonalInfoHeroCard({ form, userId }: PersonalInfoHeroCardProps) {
  const avatarUri = getUserAvatarUri(userId, form.avatarUrl);
  const initial = form.fullName[0]?.toUpperCase() ?? '?';

  return (
    <article className="settings-info-hero gains-fade">
      <div className="settings-info-hero-inner">
        <div className="settings-info-avatar-wrap">
          {avatarUri ? (
            <img className="settings-info-avatar" src={avatarUri} alt="" />
          ) : (
            <span className="settings-info-avatar-letter">{initial}</span>
          )}
        </div>
        <div className="settings-info-hero-text">
          <strong>{form.fullName || 'Joueur'}</strong>
          <span>@{form.username || 'joueur'}</span>
          <div className="settings-info-pills">
            <span>
              <Icon name="award" size={14} color="#1F2261" /> Niveau {form.levelCode}
            </span>
            <span>
              <Icon name="star" size={14} color="#FFB703" /> {form.totalScore} pts
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
