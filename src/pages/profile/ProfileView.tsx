import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { ProfileTabId } from '@app-types/profile.types';
import type { HomeInsightItem } from '@components/ui/home/HomeInsightCarousel';
import { CoverPhotoChangeModal } from '@components/ui/profile/CoverPhotoChangeModal';
import { ProfileAvatarActionSheet } from '@components/ui/profile/ProfileAvatarActionSheet';
import { ProfileHeaderSection } from '@components/ui/profile/ProfileHeaderSection';
import { ProfileInsightsCarousel } from '@components/ui/profile/ProfileInsightsCarousel';
import { ProfileNavbar } from '@components/ui/profile/ProfileNavbar';
import { ProfileQuizCard } from '@components/ui/profile/ProfileQuizCard';
import { ProfileQuizzListHeader } from '@components/ui/profile/ProfileQuizzListHeader';
import { ProfileSegmentedTabs } from '@components/ui/profile/ProfileSegmentedTabs';
import { StatisticsNavbar } from '@components/ui/statistics/StatisticsNavbar';
import { Routes } from '@constants/Routes';
import { useAuthMe } from '@hooks/useAuthMe';
import { useNetworkStatus } from '@hooks/useNetworkStatus';
import { useProfileScreenData } from '@hooks/useProfileScreenData';
import { notifyUser } from '@platform/notify';
import { getConnectionFollowService } from '@services/network/connectionFollowServiceInstance';
import { uploadMyAvatar } from '@services/profile/profileAvatarApi';
import { uploadMyCover } from '@services/profile/profileCoverApi';
import { useAuthStore } from '@stores/authStore';
import { formatJoursLabel, getLevelProgressDetail } from '@utils/levelDisplay';
import { dataUrlToImageBase64, pickImageAsDataUrl } from '@utils/pickImageAsBase64';

const QUIZ_PAGE_SIZE = 10;

function buildInsights(totalScore: number, quizzesCompleted: number, streakDays: number, isPremium: boolean): HomeInsightItem[] {
  const detail = getLevelProgressDetail(totalScore);
  return [
    {
      id: 'level',
      tag: 'Niveau',
      title: detail.fromLabel,
      body: detail.remainingLabel,
      gradient: ['#FFF8E1', '#FFE08A'],
    },
    {
      id: 'quizzes',
      tag: 'Quiz',
      title: `${quizzesCompleted} quiz terminés`,
      body: 'Continue pour progresser plus vite.',
      gradient: ['#EEF2FF', '#E0E7FF'],
    },
    {
      id: 'streak',
      tag: 'Série',
      title: formatJoursLabel(streakDays),
      body: 'Garde le rythme pour les bonus de série.',
      gradient: ['#FFF1E8', '#FFD7B8'],
    },
    {
      id: 'premium',
      tag: 'Premium',
      title: isPremium ? 'Membre Premium' : 'Passe Premium',
      body: isPremium
        ? 'Profite de tes avantages exclusifs.'
        : 'Débloque plus d’avantages et d’insights.',
      gradient: ['#E8FAF2', '#CCF1E2'],
    },
  ];
}

interface ProfileViewProps {
  userId?: string;
}

export function ProfileView({ userId }: ProfileViewProps) {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const isSelfRoute = !userId;
  const { data: me, refetch: refetchAuthMe } = useAuthMe();
  const { data, loading, error, refetch } = useProfileScreenData(userId, isSelfRoute && !token);
  const { isOnline } = useNetworkStatus();
  const [tab, setTab] = useState<ProfileTabId>('quizzo');
  const [expanded, setExpanded] = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);

  const isSelf = isSelfRoute || data?.identity.viewerRelationship === 'self';

  const insights = useMemo(
    () =>
      isSelf
        ? buildInsights(
            me?.profile?.total_score ?? 0,
            me?.profile?.quizzes_completed ?? 0,
            me?.profile?.streak_days ?? 0,
            Boolean(me?.profile?.is_premium),
          )
        : [],
    [isSelf, me],
  );

  const quizzes = data?.quizzes ?? [];
  const visibleQuizzes = expanded ? quizzes : quizzes.slice(0, QUIZ_PAGE_SIZE);

  useEffect(() => {
    if (isSelf) void refetchAuthMe({ force: true });
  }, [isSelf, refetchAuthMe]);

  useEffect(() => {
    const onFocus = () => {
      if (document.visibilityState && document.visibilityState !== 'visible') return;
      void refetch();
      if (isSelf) void refetchAuthMe({ force: true });
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [isSelf, refetch, refetchAuthMe]);

  const uploadFromPicker = useCallback(
    async (kind: 'avatar' | 'cover') => {
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
        notifyUser('Profil', e instanceof Error ? e.message : 'Impossible de mettre à jour la photo.');
      } finally {
        setUploadBusy(false);
      }
    },
    [refetch, refetchAuthMe],
  );

  const onIdentityCta = useCallback(async () => {
    if (isSelf) {
      setAvatarOpen(true);
      return;
    }
    const targetId = data?.identity.id;
    if (!targetId || data.identity.viewerRelationship !== 'none') return;
    setFollowBusy(true);
    try {
      await getConnectionFollowService().setFollowing(targetId, true);
      notifyUser('Réseau', 'Demande envoyée');
      await refetch();
    } catch (e) {
      notifyUser('Réseau', e instanceof Error ? e.message : 'Impossible d’envoyer la demande.');
    } finally {
      setFollowBusy(false);
    }
  }, [data, isSelf, refetch]);

  return (
    <div className="profile-page">
      {isSelfRoute ? (
        <ProfileNavbar />
      ) : (
        <StatisticsNavbar
          title={data?.identity.displayName ?? 'Profil'}
          onBack={() => {
            if (window.history.length > 1) navigate(-1);
            else navigate(Routes.HOME);
          }}
          onMore={() => notifyUser('Profil', 'Options à venir.')}
        />
      )}

      {!isOnline ? (
        <p className="profile-offline">Données en cache — reconnectez-vous pour actualiser.</p>
      ) : null}

      {error && !data ? (
        <div className="gains-state">
          <p>Impossible de charger ce profil.</p>
          <button type="button" className="gains-retry" onClick={() => void refetch()}>
            Réessayer
          </button>
        </div>
      ) : null}

      {loading && !data ? <p className="profile-empty">Chargement du profil…</p> : null}

      {data ? (
        <>
          <ProfileHeaderSection
            identity={data.identity}
            stats={data.stats}
            isSelf={isSelf}
            followBusy={followBusy}
            onPressCover={() => setCoverOpen(true)}
            onPressAvatar={() => setAvatarOpen(true)}
            onPressIdentityCta={() => void onIdentityCta()}
          />
          {isSelf ? <div className="profile-body"><ProfileInsightsCarousel insights={insights} /></div> : null}
          <ProfileSegmentedTabs active={tab} onChange={setTab} />
          <div className="profile-body">
            {tab === 'quizzo' ? (
              <>
                <ProfileQuizzListHeader
                  title={`${data.quizTotalCount || quizzes.length} quiz`}
                  sortLabel="Plus récents"
                />
                {visibleQuizzes.length === 0 ? (
                  <p className="profile-empty">Aucune partie récente à afficher pour le moment.</p>
                ) : (
                  <div className="profile-quiz-grid">
                    {visibleQuizzes.map((quiz) => (
                      <ProfileQuizCard key={quiz.id} quiz={quiz} />
                    ))}
                  </div>
                )}
                {quizzes.length > QUIZ_PAGE_SIZE ? (
                  <button type="button" className="profile-more" onClick={() => setExpanded((v) => !v)}>
                    {expanded ? 'Réduire' : 'Voir plus'}
                  </button>
                ) : null}
              </>
            ) : null}
            {tab === 'collections' ? (
              <p className="profile-empty">Vos trophées apparaîtront ici.</p>
            ) : null}
            {tab === 'about' ? (
              <p className="profile-empty">À propos — contenu à venir.</p>
            ) : null}
          </div>
        </>
      ) : null}

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
    </div>
  );
}
