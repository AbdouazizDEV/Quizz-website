import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { HomeActionTiles } from '@components/ui/home/HomeActionTiles';
import { HomeDailyCategoriesSection } from '@components/ui/home/HomeDailyCategoriesSection';
import { HomeHeaderCard } from '@components/ui/home/HomeHeaderCard';
import {
  NotificationDeleteConfirmModal,
  NotificationMessageModal,
} from '@components/ui/home/HomeNotificationModals';
import { HomeNotificationsSheet } from '@components/ui/home/HomeNotificationsSheet';
import { HomeSettingsDrawer } from '@components/ui/home/HomeSettingsDrawer';
import { HomeTopNavbar } from '@components/ui/home/HomeTopNavbar';
import { HomeInsightCarousel, type HomeInsightItem } from '@components/ui/home/HomeInsightCarousel';
import {
  HomeLeaderboardSection,
  type HomeLeaderboardUser,
} from '@components/ui/home/HomeLeaderboardSection';
import { HomeRewardsSection } from '@components/ui/home/HomeRewardsSection';
import { HomeSectionTitle } from '@components/ui/home/HomeSectionTitle';
import type { AppNotification } from '@app-types/notification.types';
import { buildUserProfileHref, Routes } from '@constants/Routes';
import { DefisRoutes } from '@constants/defisRoutes';
import type { HomeActionTileId } from '@constants/homeActionTiles';
import { useCategoriesExplore } from '@hooks/useCategoriesExplore';
import { useAuthMe } from '@hooks/useAuthMe';
import { useDefisDashboard } from '@hooks/defis/useDefisDashboard';
import { useGlobalLeaderboard } from '@hooks/useGlobalLeaderboard';
import { useAuthStore } from '@stores/authStore';
import { canVisitorAccessCategory, isVisitorSession } from '@services/auth/visitorAccessPolicy';
import { useNotifications } from '@hooks/useNotifications';
import { useNotificationInteractions } from '@hooks/useNotificationInteractions';
import { getUserAvatarUri, resolveProfileGender } from '@utils/getUserAvatarUri';
import {
  elapsedDaysSince,
  firstNameFromDisplay,
  formatJoursLabel,
  formatLevelCodeLabel,
  getLevelProgressDetail,
  initialsFromName,
  levelCodeFromScore,
  levelProgressEndpoints,
} from '@utils/levelDisplay';
import { useAppError } from '@providers/AppErrorProvider';

const INSIGHTS: HomeInsightItem[] = [
  {
    id: 'savoir-1',
    title: 'Le cerveau adore les quiz courts',
    body: 'Des sessions de 3 a 5 minutes ameliorent la memorisation a long terme.',
    tag: 'Neurosciences',
    gradient: ['#EEF2FF', '#E0E7FF'],
  },
  {
    id: 'savoir-2',
    title: 'Repondre vite aide la concentration',
    body: "Limiter le temps de reponse active l'attention et reduit la distraction.",
    tag: 'Productivite',
    gradient: ['#FFF7D6', '#FFE9A8'],
  },
  {
    id: 'savoir-3',
    title: 'La repetition espacee fonctionne',
    body: 'Rejouer un quiz 24h puis 72h plus tard ancre les connaissances.',
    tag: 'Methode',
    gradient: ['#E8FAF2', '#CCF1E2'],
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const { showAppError } = useAppError();
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [activeInsight, setActiveInsight] = useState(0);
  const token = useAuthStore((s) => s.token);
  const hasRegisteredAccount = useAuthStore((s) => s.hasRegisteredAccount);
  const { data: me, loading: meLoading, refetch: refetchAuthMe } = useAuthMe();
  const { data: defisDashboard } = useDefisDashboard(me?.user?.id);
  const { items: leaderboardRows, me: leaderboardMe, refetch: refetchLeaderboard } =
    useGlobalLeaderboard(5);
  const {
    data: allCategories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategoriesExplore();
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);
  const {
    items: notifications,
    unreadCount,
    loading: notificationsLoading,
    actionId: notificationActionId,
    refresh: refreshNotifications,
    markRead,
    markAllRead,
    remove: removeNotification,
    acceptFriend,
    rejectFriend,
    acceptDuel,
    rejectDuel,
  } = useNotifications();
  const {
    messageItem,
    deleteTarget,
    deleteBusy,
    handlePress: handleNotificationPress,
    requestDelete,
    cancelDelete,
    confirmDelete,
    closeMessage,
  } = useNotificationInteractions({
    markRead,
    remove: removeNotification,
    onNavigate: () => setNotificationsVisible(false),
  });

  const isVisitor = useMemo(
    () => isVisitorSession({ token, hasRegisteredAccount }),
    [token, hasRegisteredAccount],
  );

  useEffect(() => {
    const refresh = () => {
      void refetchAuthMe({ force: true });
      void refetchLeaderboard();
      if (token?.trim()) {
        void refreshNotifications();
      }
    };
    refresh();
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [refetchAuthMe, refetchLeaderboard, refreshNotifications, token]);

  const openNotifications = useCallback(async () => {
    setNotificationsVisible(true);
    if (!token?.trim()) return;
    try {
      await refreshNotifications();
    } catch {
      showAppError('Impossible de charger les notifications pour le moment.', {
        title: 'Notifications',
        onRetry: () => {
          setNotificationsVisible(true);
          void refreshNotifications();
        },
      });
    }
  }, [refreshNotifications, showAppError, token]);

  const onAcceptDuelNotification = useCallback(
    async (item: AppNotification) => {
      try {
        const duelId = await acceptDuel(item);
        setNotificationsVisible(false);
        navigate(DefisRoutes.duelDetail(duelId));
      } catch (error) {
        showAppError(error instanceof Error ? error.message : "Impossible d'accepter le duel.", {
          title: 'Duel',
        });
      }
    },
    [acceptDuel, navigate, showAppError],
  );

  const onRejectDuelNotification = useCallback(
    async (item: AppNotification) => {
      try {
        await rejectDuel(item);
      } catch (error) {
        showAppError(error instanceof Error ? error.message : 'Impossible de refuser le duel.', {
          title: 'Duel',
        });
      }
    },
    [rejectDuel, showAppError],
  );

  const topThreeCategories = useMemo(() => allCategories.slice(0, 3), [allCategories]);

  const goToCategory = useCallback(
    (categorySlug: string) => {
      if (
        isVisitorSession({ token, hasRegisteredAccount }) &&
        !canVisitorAccessCategory({ slug: categorySlug })
      ) {
        navigate(Routes.LOGIN);
        return;
      }
      navigate(`${Routes.CATEGORIES}/${categorySlug}`);
    },
    [hasRegisteredAccount, navigate, token],
  );

  const goToDefisTile = useCallback(
    (tileId: HomeActionTileId) => {
      switch (tileId) {
        case 'challenge':
          navigate(DefisRoutes.challengeList);
          break;
        case 'tournament':
          navigate(DefisRoutes.tournoiList);
          break;
        case 'duel':
          navigate(DefisRoutes.duelHub);
          break;
      }
    },
    [navigate],
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const tick = () => {
      if (mq.matches) return;
      setActiveInsight((prev) => (prev + 1) % INSIGHTS.length);
    };
    const timer = window.setInterval(tick, 4200);
    return () => window.clearInterval(timer);
  }, []);

  const headerVm = useMemo(() => {
    const profile = me?.profile;
    const meta = me?.user?.user_metadata as Record<string, unknown> | undefined;
    const userRaw = me?.user as Record<string, unknown> | undefined;
    const display =
      profile?.full_name?.trim() ||
      (typeof meta?.full_name === 'string' ? meta.full_name.trim() : '') ||
      (typeof meta?.username === 'string' ? meta.username.trim() : '') ||
      profile?.username?.trim() ||
      '';
    const first = firstNameFromDisplay(display || 'Joueur');
    const initials = initialsFromName(display || first);
    const score = profile?.total_score ?? 0;
    const levelCode = levelCodeFromScore(score);
    const progressDetail = getLevelProgressDetail(score);
    const progress = progressDetail.progress;
    const { left, right } = levelProgressEndpoints(score);
    const streak = profile?.streak_days ?? 0;
    const createdAt = typeof userRaw?.created_at === 'string' ? userRaw.created_at : undefined;
    const elapsedDays = elapsedDaysSince(createdAt);
    const daysActive = Math.max(profile?.days_active ?? 0, elapsedDays);
    const clockLabel =
      streak > 0 ? formatJoursLabel(streak) : daysActive > 0 ? formatJoursLabel(daysActive) : '0 jour';
    const loadingPlaceholders = Boolean(token?.trim()) && meLoading;
    const meRank = leaderboardMe?.rank;
    const gender = resolveProfileGender(
      (profile as Record<string, unknown> | undefined)?.gender,
      meta?.gender,
    );

    return {
      userId: me?.user?.id,
      avatarInitial: initials,
      avatarUri: getUserAvatarUri(
        me?.user?.id ?? 'me',
        profile?.avatar_url ?? (typeof meta?.avatar_url === 'string' ? meta.avatar_url : undefined),
        gender,
      ),
      displayNameWithEmoji: loadingPlaceholders ? '··· 👋' : `${first} 👋`,
      totalScoreDisplay: loadingPlaceholders ? '—' : String(score),
      levelLabel: formatLevelCodeLabel(levelCode),
      rankLabel: meRank ? `#${meRank}` : '#—',
      streakOrDaysLabel: loadingPlaceholders ? '···' : clockLabel,
      progressLabelLeft: left,
      progressLabelRight: right,
      pointsRemainingLabel: loadingPlaceholders ? '···' : progressDetail.remainingLabel,
      progressPercentLabel: loadingPlaceholders ? '' : `${progressDetail.percent}%`,
      progress,
    };
  }, [leaderboardMe?.rank, me, meLoading, token]);

  const leaderboardUsers = useMemo<HomeLeaderboardUser[]>(
    () =>
      leaderboardRows.map((row, idx) => ({
        id: row.id,
        name: row.displayName,
        points: row.score,
        avatar: row.avatarUrl,
        rank: row.rank || idx + 1,
      })),
    [leaderboardRows],
  );

  return (
    <div className="home-page">
      <HomeTopNavbar
        notificationCount={unreadCount}
        onPressNotifications={() => void openNotifications()}
        onPressMenu={() => setSettingsDrawerVisible(true)}
      />

      <HomeHeaderCard
        progress={headerVm.progress}
        userId={headerVm.userId}
        avatarInitial={headerVm.avatarInitial}
        avatarUri={headerVm.avatarUri}
        displayNameWithEmoji={headerVm.displayNameWithEmoji}
        totalScoreDisplay={headerVm.totalScoreDisplay}
        levelLabel={headerVm.levelLabel}
        rankLabel={headerVm.rankLabel}
        streakOrDaysLabel={headerVm.streakOrDaysLabel}
        progressLabelLeft={headerVm.progressLabelLeft}
        progressLabelRight={headerVm.progressLabelRight}
        pointsRemainingLabel={headerVm.pointsRemainingLabel}
        progressPercentLabel={headerVm.progressPercentLabel}
        onPressAvatar={() => navigate(Routes.PROFILE)}
      />

      <div className="home-board">
        <section className="home-section home-board-insights">
          <HomeSectionTitle title="Le savoir du jour" />
          <HomeInsightCarousel
            insights={INSIGHTS}
            activeIndex={activeInsight}
            onChangeIndex={setActiveInsight}
            carouselRef={carouselRef}
          />
        </section>

        <section className="home-section home-board-categories">
          <HomeSectionTitle
            title="Quizz du jour"
            action="Voir tout"
            onActionPress={() => navigate(Routes.CATEGORIES)}
          />
          <HomeDailyCategoriesSection
            categories={topThreeCategories}
            loading={categoriesLoading}
            error={categoriesError}
            onPressCategory={goToCategory}
          />
        </section>

        <div className="home-board-tiles">
          <HomeActionTiles
            onTilePress={goToDefisTile}
            pulseIds={{
              challenge: (defisDashboard?.activeChallengeCount ?? 0) > 0,
              tournament: (defisDashboard?.activeTournamentCount ?? 0) > 0,
              duel: (defisDashboard?.pendingDuelCount ?? 0) > 0,
            }}
          />
        </div>

        <section className="home-section home-board-rank">
          <HomeSectionTitle
            title="Top classement"
            action="Voir complet"
            onActionPress={() => navigate(Routes.PLAYERS)}
          />
          <HomeLeaderboardSection
            users={leaderboardUsers}
            onPressAvatar={(userId) => navigate(buildUserProfileHref(userId))}
          />
        </section>

        <section className="home-section home-board-rewards">
          <HomeSectionTitle title="Voir mes récompenses" />
          <HomeRewardsSection />
        </section>
      </div>

      <HomeNotificationsSheet
        visible={notificationsVisible}
        loading={notificationsLoading}
        items={notifications}
        unreadCount={unreadCount}
        actionId={notificationActionId}
        onClose={() => setNotificationsVisible(false)}
        onMarkAllRead={() => void markAllRead()}
        onPressItem={(item) => void handleNotificationPress(item)}
        onDeleteRequest={requestDelete}
        onAcceptFriend={(id) => void acceptFriend(id)}
        onRejectFriend={(id) => void rejectFriend(id)}
        onAcceptDuel={(item) => void onAcceptDuelNotification(item)}
        onRejectDuel={(item) => void onRejectDuelNotification(item)}
        onSeeAll={() => {
          setNotificationsVisible(false);
          navigate(Routes.SETTINGS_NOTIFICATIONS);
        }}
      />
      <NotificationMessageModal item={messageItem} onClose={closeMessage} />
      <NotificationDeleteConfirmModal
        item={deleteTarget}
        busy={deleteBusy}
        onCancel={cancelDelete}
        onConfirm={() => void confirmDelete()}
      />
      <HomeSettingsDrawer
        visible={settingsDrawerVisible}
        onClose={() => setSettingsDrawerVisible(false)}
        isVisitor={isVisitor}
      />
    </div>
  );
}
