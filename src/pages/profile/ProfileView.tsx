import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { ProfileTabId, ViewerRelationship } from '@app-types/profile.types';
import { CoverPhotoChangeModal } from '@components/ui/profile/CoverPhotoChangeModal';
import { ProfileAvatarActionSheet } from '@components/ui/profile/ProfileAvatarActionSheet';
import { ProfileHeaderSection } from '@components/ui/profile/ProfileHeaderSection';
import { ProfileNavbar } from '@components/ui/profile/ProfileNavbar';
import { ProfileSegmentedTabs } from '@components/ui/profile/ProfileSegmentedTabs';
import { ProfileTabContent } from '@components/ui/profile/ProfileTabContent';
import { StatisticsNavbar } from '@components/ui/statistics/StatisticsNavbar';
import { Routes } from '@constants/Routes';
import { useAuthMe } from '@hooks/useAuthMe';
import { useNetworkStatus } from '@hooks/useNetworkStatus';
import { useProfileScreenData } from '@hooks/useProfileScreenData';
import { notifyUser } from '@platform/notify';
import { useAppError } from '@providers/AppErrorProvider';
import { ApiConnectionFollowService } from '@services/network/ApiConnectionFollowService';
import { uploadMyAvatar } from '@services/profile/profileAvatarApi';
import { uploadMyCover } from '@services/profile/profileCoverApi';
import { useAuthStore } from '@stores/authStore';
import { getLevelProgressDetail } from '@utils/levelDisplay';
import { dataUrlToImageBase64, pickImageAsDataUrl } from '@utils/pickImageAsBase64';

interface ProfileViewProps {
  userId?: string;
}

export function ProfileView({ userId }: ProfileViewProps) {
  const navigate = useNavigate();
  const { showAppError } = useAppError();
  const token = useAuthStore((s) => s.token);
  const viewedUserId = userId?.trim() || undefined;
  const isExternalProfile = Boolean(viewedUserId);
  const { data: me, refetch: refetchAuthMe } = useAuthMe();
  const { data, loading, error, refetch } = useProfileScreenData(
    viewedUserId,
    !isExternalProfile && !token,
  );
  const { isOnline } = useNetworkStatus();
  const [tab, setTab] = useState<ProfileTabId>('quizzo');
  const [coverOpen, setCoverOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);
  const [relationshipOverride, setRelationshipOverride] = useState<ViewerRelationship | null>(null);

  const effectiveRelationship = relationshipOverride ?? data?.identity.viewerRelationship ?? 'none';
  const progressDetail = useMemo(
    () => getLevelProgressDetail(me?.profile?.total_score ?? 0),
    [me?.profile?.total_score],
  );

  const identityActionVm = useMemo(() => {
    if (!isExternalProfile) {
      return { label: 'Modifier le profil', variant: 'primary' as const, disabled: false };
    }
    if (effectiveRelationship === 'self') {
      return { label: 'C’est vous', variant: 'pending' as const, disabled: true };
    }
    if (effectiveRelationship === 'friends') {
      return {
        label: data?.identity.gender === 'female' ? 'Amie' : 'Ami',
        variant: 'friend' as const,
        disabled: followBusy,
      };
    }
    if (effectiveRelationship === 'pending') {
      return { label: 'En attente', variant: 'pending' as const, disabled: true };
    }
    return { label: 'Suivre', variant: 'primary' as const, disabled: followBusy };
  }, [data?.identity.gender, effectiveRelationship, followBusy, isExternalProfile]);

  useEffect(() => {
    setRelationshipOverride(null);
    setTab('quizzo');
  }, [viewedUserId]);

  useEffect(() => {
    if (!isExternalProfile) void refetchAuthMe({ force: true });
  }, [isExternalProfile, refetchAuthMe]);

  useEffect(() => {
    const onFocus = () => {
      if (document.visibilityState && document.visibilityState !== 'visible') return;
      setRelationshipOverride(null);
      void refetch();
      if (!isExternalProfile) void refetchAuthMe({ force: true });
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [isExternalProfile, refetch, refetchAuthMe]);

  const uploadFromPicker = useCallback(
    async (kind: 'avatar' | 'cover') => {
      if (isExternalProfile) return;
      const dataUrl = await pickImageAsDataUrl();
      if (!dataUrl) return;
      setUploadBusy(true);
      try {
        const imageBase64 = dataUrlToImageBase64(dataUrl);
        if (kind === 'avatar') {
          await uploadMyAvatar(imageBase64);
          notifyUser('Profil', 'Avatar mis à jour avec succès.');
          setAvatarOpen(false);
        } else {
          await uploadMyCover(imageBase64);
          notifyUser('Profil', 'Photo de couverture mise à jour.');
          setCoverOpen(false);
        }
        await refetch();
        await refetchAuthMe({ force: true });
      } catch (e) {
        showAppError(e instanceof Error ? e.message : 'Impossible de mettre à jour la photo.', {
          title: 'Profil',
        });
      } finally {
        setUploadBusy(false);
      }
    },
    [isExternalProfile, refetch, refetchAuthMe, showAppError],
  );

  const onIdentityAction = useCallback(async () => {
    if (!isExternalProfile) {
      setAvatarOpen(true);
      return;
    }
    if (!viewedUserId || followBusy) return;

    if (effectiveRelationship === 'none') {
      setFollowBusy(true);
      try {
        await new ApiConnectionFollowService().setFollowing(viewedUserId, true);
        setRelationshipOverride('pending');
        notifyUser('Demande envoyée', "La demande d'ami a été envoyée.");
      } catch (e) {
        showAppError(e instanceof Error ? e.message : "Impossible d'envoyer la demande d'ami.", {
          title: "Demande d'ami",
        });
      } finally {
        setFollowBusy(false);
      }
      return;
    }

    if (effectiveRelationship === 'friends') {
      setFollowBusy(true);
      try {
        await new ApiConnectionFollowService().setFollowing(viewedUserId, false);
        setRelationshipOverride('none');
        notifyUser('Réseau', 'Vous ne suivez plus ce joueur.');
      } catch (e) {
        showAppError(e instanceof Error ? e.message : 'Impossible d’arrêter de suivre.', {
          title: 'Réseau',
        });
      } finally {
        setFollowBusy(false);
      }
    }
  }, [effectiveRelationship, followBusy, isExternalProfile, showAppError, viewedUserId]);

  return (
    <div className="profile-page">
      {isExternalProfile ? (
        <StatisticsNavbar
          title={data?.identity.displayName ?? 'Profil'}
          onBack={() => {
            if (window.history.length > 1) navigate(-1);
            else navigate(Routes.HOME);
          }}
          onMore={() => notifyUser('Menu', 'Options à venir.')}
        />
      ) : (
        <ProfileNavbar />
      )}

      {!isOnline ? (
        <p className="profile-offline">Données en cache — reconnectez-vous pour actualiser.</p>
      ) : null}

      {loading && !data ? (
        <div className="profile-centered" role="status" aria-label="Chargement">
          <div className="gains-spinner" />
        </div>
      ) : null}

      {error && !data ? (
        <div className="profile-centered">
          <p>Impossible de charger le profil.</p>
          <button type="button" className="gains-retry" onClick={() => void refetch()}>
            Réessayer
          </button>
        </div>
      ) : null}

      {data ? (
        <div className="profile-column profile-board">
          <div className="profile-board-header">
            <ProfileHeaderSection
              coverUri={data.identity.coverUri}
              displayName={data.identity.displayName}
              handle={data.identity.handle}
              avatarUri={data.identity.avatarUri}
              stats={data.stats}
              onEditProfile={() => void onIdentityAction()}
              onPressChangeCover={() => {
                if (!isExternalProfile) setCoverOpen(true);
              }}
              onPressAvatar={isExternalProfile ? undefined : () => setAvatarOpen(true)}
              identityActionLabel={identityActionVm.label}
              identityActionVariant={identityActionVm.variant}
              identityActionDisabled={identityActionVm.disabled}
              showInsightsCarousel={!isExternalProfile}
              progressDetail={isExternalProfile ? null : progressDetail}
              quizzesCompleted={data.quizTotalCount}
              streakDays={me?.profile?.streak_days ?? 0}
              isPremium={Boolean(me?.profile?.is_premium)}
              premiumDaysLeft={9}
              coverEditable={!isExternalProfile}
            />
          </div>
          <div className="profile-board-content">
            <ProfileSegmentedTabs active={tab} onChange={setTab} />
            <ProfileTabContent tab={tab} quizTotalCount={data.quizTotalCount} quizzes={data.quizzes} />
          </div>
        </div>
      ) : null}

      {!isExternalProfile ? (
        <>
          <CoverPhotoChangeModal
            open={coverOpen}
            busy={uploadBusy}
            onClose={() => setCoverOpen(false)}
            onPick={() => void uploadFromPicker('cover')}
          />
          <ProfileAvatarActionSheet
            open={avatarOpen}
            busy={uploadBusy}
            onClose={() => setAvatarOpen(false)}
            onPickGallery={() => void uploadFromPicker('avatar')}
            onOpenPersonalInfo={() => navigate(Routes.SETTINGS_PERSONAL)}
          />
        </>
      ) : null}

      {uploadBusy && !isExternalProfile ? (
        <div className="profile-upload-overlay" role="status" aria-label="Envoi en cours">
          <div className="gains-spinner is-light" />
        </div>
      ) : null}
    </div>
  );
}
