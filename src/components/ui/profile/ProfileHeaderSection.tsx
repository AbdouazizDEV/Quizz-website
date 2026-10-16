import type { ReactNode } from 'react';

import type { ProfileStatItem } from '@app-types/profile.types';
import type { PlayerBadgeView } from '@constants/westAfricanBadges';
import { ProfileCoverBanner } from '@components/ui/profile/ProfileCoverBanner';
import { ProfileIdentityRow } from '@components/ui/profile/ProfileIdentityRow';
import { ProfileInsightsCarousel } from '@components/ui/profile/ProfileInsightsCarousel';
import { ProfileStatsGrid } from '@components/ui/profile/ProfileStatsGrid';
import { getLevelProgressDetail, type LevelProgressDetail } from '@utils/levelDisplay';

interface ProfileHeaderSectionProps {
  coverUri: string;
  displayName: string;
  handle: string;
  avatarUri: string;
  stats: ProfileStatItem[];
  onEditProfile: () => void;
  onPressChangeCover: () => void;
  onPressAvatar?: () => void;
  identityActionLabel?: string;
  identityActionVariant?: 'primary' | 'pending' | 'friend';
  identityActionDisabled?: boolean;
  showInsightsCarousel?: boolean;
  progressDetail?: LevelProgressDetail | null;
  quizzesCompleted?: number;
  streakDays?: number;
  isPremium?: boolean;
  premiumDaysLeft?: number;
  premiumTitle?: string;
  premiumBody?: string;
  coverEditable?: boolean;
  badgeSlot?: ReactNode;
  earnedBadges?: PlayerBadgeView[];
}

export function ProfileHeaderSection({
  coverUri,
  displayName,
  handle,
  avatarUri,
  stats,
  onEditProfile,
  onPressChangeCover,
  onPressAvatar,
  identityActionLabel,
  identityActionVariant,
  identityActionDisabled,
  showInsightsCarousel = false,
  progressDetail = null,
  quizzesCompleted = 0,
  streakDays = 0,
  isPremium = false,
  premiumDaysLeft = 0,
  premiumTitle,
  premiumBody,
  coverEditable = true,
  badgeSlot,
  earnedBadges,
}: ProfileHeaderSectionProps) {
  const resolvedProgress = progressDetail ?? getLevelProgressDetail(0);

  return (
    <div className="profile-header-block">
      <ProfileCoverBanner
        coverUri={coverUri}
        editable={coverEditable}
        onPressChangeCover={onPressChangeCover}
      />
      <div className="profile-header-inner">
        <ProfileIdentityRow
          displayName={displayName}
          handle={handle}
          avatarUri={avatarUri}
          onEditProfile={onEditProfile}
          onPressAvatar={onPressAvatar}
          actionLabel={identityActionLabel}
          actionVariant={identityActionVariant}
          actionDisabled={identityActionDisabled}
          badgeSlot={badgeSlot}
          levelCode={stats.find((item) => item.id === 'level')?.valueLabel}
        />
        <hr className="profile-header-divider" />
        {showInsightsCarousel ? (
          <ProfileInsightsCarousel
            progress={resolvedProgress}
            stats={stats}
            quizzesCompleted={quizzesCompleted}
            streakDays={streakDays}
            isPremium={isPremium}
            premiumDaysLeft={premiumDaysLeft}
            premiumTitle={premiumTitle}
            premiumBody={premiumBody}
            earnedBadges={earnedBadges}
          />
        ) : (
          <ProfileStatsGrid stats={stats} />
        )}
      </div>
    </div>
  );
}
