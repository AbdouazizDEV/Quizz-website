import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

import { Routes } from '@constants/Routes';
import { shareFriendProfile } from '@services/network/shareFriendProfile';
import { buildFriendQrProfile, encodeFriendQrScanPayload } from '@utils/friendQrPayload';
import { BadgeChip } from '@components/ui/badges/BadgeChip';
import { LevelBadge } from '@components/ui/home/LevelBadge';
import type { PlayerBadgeView } from '@constants/westAfricanBadges';
import { Icon } from '@components/ui/Icon';

const REF_WIDTH = 390;
const DESKTOP_MQ = '(min-width: 768px)';

interface HomeHeaderCardProps {
  progress: number;
  userId?: string;
  avatarInitial?: string;
  avatarUri?: string;
  displayNameWithEmoji?: string;
  totalScoreDisplay?: string;
  levelLabel?: string;
  levelCode?: string;
  featuredBadge?: PlayerBadgeView | null;
  rankLabel?: string;
  streakOrDaysLabel?: string;
  progressLabelLeft?: string;
  progressLabelRight?: string;
  pointsRemainingLabel?: string;
  progressPercentLabel?: string;
  onPressAvatar?: () => void;
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_MQ).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_MQ);
    const onChange = () => setIsDesktop(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return isDesktop;
}

function QrActionButton({
  icon,
  label,
  onPress,
  variant = 'primary',
}: {
  icon: string;
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <button
      type="button"
      className={`home-qr-btn ${variant === 'secondary' ? 'is-secondary' : 'is-primary'}`}
      onClick={onPress}
    >
      <Icon name={icon} size={18} color={variant === 'secondary' ? '#FFFFFF' : '#2A2D5E'} />
      {label}
    </button>
  );
}

export function HomeHeaderCard({
  progress,
  userId,
  avatarInitial = 'A',
  avatarUri,
  displayNameWithEmoji = 'Joueur 👋',
  totalScoreDisplay = '0',
  levelLabel = '🌱 Niveau 1 · Débutant',
  levelCode,
  featuredBadge = null,
  rankLabel = '#—',
  streakOrDaysLabel = '0 jour',
  progressLabelLeft = 'Niv. 1',
  progressLabelRight = 'Niv. 2',
  pointsRemainingLabel,
  progressPercentLabel,
  onPressAvatar,
}: HomeHeaderCardProps) {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const [isFlipped, setIsFlipped] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const width = typeof window !== 'undefined' ? Math.min(window.innerWidth, 420) : 390;

  useEffect(() => {
    setAvatarFailed(false);
  }, [avatarUri]);

  const sizes = useMemo(() => {
    const widthRatio = Math.min(1.08, Math.max(0.78, width / REF_WIDTH));
    const s = (dp: number) => Math.max(10, Math.round(dp * widthRatio));
    return {
      greeting: s(14),
      name: s(26),
      nameLine: s(31),
      avatar: s(18),
      avatarBox: s(44),
      scoreLabel: s(13),
      scoreValue: s(38),
      scoreValueLine: s(42),
      level: s(13),
      meta: s(17),
      metaLine: s(21),
      metaIcon: s(15),
      progressLabel: s(12),
      progressTrack: Math.max(6, s(7)),
      backTitle: s(16),
      backHint: s(12),
      qrSize: Math.max(96, Math.min(128, Math.round(width * 0.28))),
      miniQrBox: Math.max(48, Math.min(58, Math.round(52 * widthRatio))),
      miniQrInner: Math.max(34, Math.min(42, Math.round(38 * widthRatio))),
    };
  }, [width]);

  const qrProfile = useMemo(() => {
    if (!userId?.trim()) return null;
    const displayName = displayNameWithEmoji.replace(/\s*👋\s*$/, '').trim() || 'Joueur';
    const score = Number.parseInt(totalScoreDisplay.replace(/\s/g, ''), 10);
    return buildFriendQrProfile({
      userId,
      displayName,
      totalScore: Number.isFinite(score) ? score : 0,
      levelLabel,
    });
  }, [displayNameWithEmoji, levelLabel, totalScoreDisplay, userId]);

  const qrValue = useMemo(
    () => (qrProfile ? encodeFriendQrScanPayload(qrProfile) : ''),
    [qrProfile],
  );

  const toggleFlip = useCallback(() => {
    if (isDesktop) return;
    setIsFlipped((prev) => !prev);
  }, [isDesktop]);

  const focusQrCard = useCallback(() => {
    document.getElementById('home-qr-card')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, []);

  const onMiniQr = isDesktop ? focusQrCard : toggleFlip;

  const onShareProfile = useCallback(async () => {
    if (!qrProfile) return;
    await shareFriendProfile(qrProfile);
  }, [qrProfile]);

  const scoreFace = (
    <div className="home-header-card is-score">
      <div className="home-glow" aria-hidden />
      <button
        type="button"
        className="home-mini-qr"
        aria-label="Afficher mon QR profil"
        onClick={onMiniQr}
        style={{
          width: sizes.miniQrBox,
          height: sizes.miniQrBox,
          borderRadius: Math.round(sizes.miniQrBox * 0.2),
        }}
      >
        {qrValue ? (
          <QRCodeSVG value={qrValue} size={sizes.miniQrInner} bgColor="transparent" fgColor="#2A2D5E" />
        ) : (
          <Icon name="user-x" size={sizes.miniQrInner * 0.45} color="#9CA3CF" />
        )}
        <span className="home-mini-qr-accent" />
      </button>

      <div className="home-header-top" style={{ paddingRight: sizes.miniQrBox + 10 }}>
        <button
          type="button"
          className="home-avatar"
          onClick={onPressAvatar}
          style={{
            width: sizes.avatarBox,
            height: sizes.avatarBox,
            borderRadius: sizes.avatarBox / 2,
            fontSize: sizes.avatar,
          }}
        >
          {avatarUri && !avatarFailed ? (
            <img src={avatarUri} alt="" onError={() => setAvatarFailed(true)} />
          ) : (
            avatarInitial
          )}
        </button>
        <button type="button" className="home-header-identity" onClick={isDesktop ? undefined : toggleFlip}>
          <p className="home-header-greeting" style={{ fontSize: sizes.greeting }}>
            Bonjour
          </p>
          <p
            className="home-header-name"
            style={{ fontSize: sizes.name, lineHeight: `${sizes.nameLine}px` }}
          >
            {displayNameWithEmoji}
          </p>
        </button>
      </div>

      <div
        className="home-score-card"
        role={isDesktop ? undefined : 'button'}
        tabIndex={isDesktop ? undefined : 0}
        onClick={isDesktop ? undefined : toggleFlip}
        onKeyDown={(event) => {
          if (!isDesktop && (event.key === 'Enter' || event.key === ' ')) toggleFlip();
        }}
      >
        <p className="home-score-label" style={{ fontSize: sizes.scoreLabel }}>
          Ton score
        </p>
        <p
          className="home-score-value"
          style={{ fontSize: sizes.scoreValue, lineHeight: `${sizes.scoreValueLine}px` }}
        >
          {totalScoreDisplay}
        </p>
        <p className="home-score-level" style={{ fontSize: sizes.level }}>
          <LevelBadge code={levelCode} />
          {levelLabel}
        </p>
        <div className="home-score-meta">
          <div className="home-meta-item" style={{ fontSize: sizes.meta, lineHeight: `${sizes.metaLine}px` }}>
            {featuredBadge ? <BadgeChip badge={featuredBadge} /> : <Icon name="award" size={sizes.metaIcon} color="#F1C943" />}
            {rankLabel}
          </div>
          <div className="home-meta-item" style={{ fontSize: sizes.meta, lineHeight: `${sizes.metaLine}px` }}>
            <Icon name="clock" size={sizes.metaIcon} color="#FF7A4D" />
            {streakOrDaysLabel}
          </div>
        </div>
        <div className="home-progress-labels">
          <span className="home-progress-label" style={{ fontSize: sizes.progressLabel }}>
            {progressLabelLeft}
          </span>
          {pointsRemainingLabel ? (
            <span className="home-progress-remaining" style={{ fontSize: sizes.progressLabel }}>
              {pointsRemainingLabel}
            </span>
          ) : null}
          <span className="home-progress-label" style={{ fontSize: sizes.progressLabel }}>
            {progressLabelRight}
          </span>
        </div>
        <div className="home-progress-row">
          <div
            className="home-progress-track"
            style={{ height: sizes.progressTrack, borderRadius: sizes.progressTrack / 2 }}
          >
            <div
              className="home-progress-fill"
              style={{
                height: sizes.progressTrack,
                borderRadius: sizes.progressTrack / 2,
                width: `${Math.min(100, Math.max(0, progress * 100))}%`,
              }}
            />
          </div>
          {progressPercentLabel ? (
            <span className="home-progress-percent" style={{ fontSize: sizes.progressLabel }}>
              {progressPercentLabel}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );

  const qrFace = (
    <div id="home-qr-card" className="home-header-card is-qr">
      <div className="home-qr-face">
        <button
          type="button"
          className="home-qr-tap"
          onClick={isDesktop ? undefined : toggleFlip}
          aria-label="Retourner à la carte score"
        >
          <p className="home-qr-title" style={{ fontSize: sizes.backTitle }}>
            Mon profil Quizz+
          </p>
          <p className="home-qr-hint" style={{ fontSize: sizes.backHint }}>
            Scanne ce QR pour m’ajouter en ami
          </p>
          <div className="home-qr-wrap">
            {qrProfile && qrValue ? (
              <QRCodeSVG value={qrValue} size={sizes.qrSize} bgColor="#FFFFFF" fgColor="#1F2347" />
            ) : (
              <div className="home-qr-placeholder" style={{ width: sizes.qrSize, height: sizes.qrSize }}>
                <Icon name="user-x" size={28} color="#9CA3CF" />
                Connecte-toi pour afficher ton QR
              </div>
            )}
          </div>
        </button>
        <div className="home-qr-actions">
          <QrActionButton icon="share-2" label="Partager" onPress={() => void onShareProfile()} />
          <QrActionButton
            icon="maximize"
            label="Scanner"
            variant="secondary"
            onPress={() => navigate(Routes.FRIEND_SCAN)}
          />
        </div>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <div className="home-header-duo">
        {scoreFace}
        {qrFace}
      </div>
    );
  }

  return (
    <div className="home-flip-scene">
      <div className={isFlipped ? 'home-flip-card is-flipped' : 'home-flip-card'}>
        <div className="home-card-face">{scoreFace}</div>
        <div className="home-card-face is-back">{qrFace}</div>
      </div>
    </div>
  );
}
