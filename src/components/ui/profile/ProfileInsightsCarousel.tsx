import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import type { ProfileStatItem } from '@app-types/profile.types';
import { Icon } from '@components/ui/Icon';
import { ProfileCircularPerformance } from '@components/ui/profile/ProfileCircularPerformance';
import { Routes } from '@constants/Routes';
import type { LevelProgressDetail } from '@utils/levelDisplay';

const AUTO_INTERVAL_MS = 8000;
const SLIDE_IDS = ['progression', 'statistiques', 'badges', 'premium'] as const;

interface ProfileInsightsCarouselProps {
  progress: LevelProgressDetail;
  stats: ProfileStatItem[];
  quizzesCompleted: number;
  streakDays: number;
  isPremium: boolean;
  premiumDaysLeft?: number;
}

function SlideChrome({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="profile-insight-slide">
      <div className="profile-insight-slide-head">
        <span className="profile-insight-icon">
          <Icon name={icon} size={16} color="#1F2261" />
        </span>
        <h3>{title}</h3>
      </div>
      {children}
    </article>
  );
}

export function ProfileInsightsCarousel({
  progress,
  stats,
  quizzesCompleted,
  streakDays,
  isPremium,
  premiumDaysLeft = 0,
}: ProfileInsightsCarouselProps) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);
  const indexRef = useRef(0);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((next: number) => {
    const clamped = ((next % SLIDE_IDS.length) + SLIDE_IDS.length) % SLIDE_IDS.length;
    indexRef.current = clamped;
    setIndex(clamped);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (pausedRef.current) return;
      goTo(indexRef.current + 1);
    }, AUTO_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [goTo]);

  const quizCount = stats.find((s) => s.id === 'quizzo')?.valueLabel ?? String(quizzesCompleted);
  const plays = stats.find((s) => s.id === 'plays')?.valueLabel ?? '0';
  const followers = stats.find((s) => s.id === 'followers')?.valueLabel ?? '0';

  const performanceRatio = useMemo(() => {
    const q = Number(quizzesCompleted) || 0;
    if (q <= 0) return 0.42;
    return Math.min(0.96, 0.45 + Math.min(q, 40) / 80 + Math.min(streakDays, 14) / 50);
  }, [quizzesCompleted, streakDays]);

  const slides: { id: (typeof SLIDE_IDS)[number]; node: ReactNode }[] = [
    {
      id: 'progression',
      node: (
        <SlideChrome icon="bookmark" title="Progression">
          <p className="profile-insight-level">
            Niveau {progress.levelNumber}
            {progress.nextLevelNumber ? ` → Niveau ${progress.nextLevelNumber}` : ' · Max'}
          </p>
          <p className="profile-insight-remaining">{progress.remainingLabel}</p>
          <div className="profile-insight-bar-row">
            <div className="profile-insight-bar">
              <span style={{ width: `${Math.min(100, Math.max(0, progress.percent))}%` }} />
            </div>
            <strong>{progress.percent}%</strong>
          </div>
        </SlideChrome>
      ),
    },
    {
      id: 'statistiques',
      node: (
        <SlideChrome icon="message-square" title="Statistiques">
          <div className="profile-insight-stats">
            <ProfileCircularPerformance ratio={performanceRatio} label="Perf." size={88} />
            <div>
              <p>
                Quiz joués : <strong>{quizCount}</strong>
              </p>
              <p>
                Parties : <strong>{plays}</strong>
              </p>
              <p>
                Série : <strong>{streakDays} j</strong>
              </p>
              <p>
                Abonnés : <strong>{followers}</strong>
              </p>
            </div>
          </div>
        </SlideChrome>
      ),
    },
    {
      id: 'badges',
      node: (
        <SlideChrome icon="award" title="Badges">
          <p className="profile-insight-copy">
            Curieux du jour · Série {Math.max(streakDays, 1)} jours · Top 10 hebdo
          </p>
          <button type="button" className="profile-insight-btn" onClick={() => navigate(Routes.STATISTICS)}>
            Voir mes badges
          </button>
        </SlideChrome>
      ),
    },
    {
      id: 'premium',
      node: (
        <SlideChrome icon="star" title="Essai premium">
          <p className="profile-insight-copy">
            {isPremium
              ? `Actif${premiumDaysLeft > 0 ? ` · ${premiumDaysLeft} jours restants` : ''}`
              : 'Non activé · Débloquez plus de quiz'}
          </p>
          <button type="button" className="profile-insight-btn" onClick={() => navigate(Routes.PREMIUM)}>
            Voir les avantages
          </button>
        </SlideChrome>
      ),
    },
  ];

  return (
    <div className="profile-insight-carousel">
      <div
        className="profile-insight-viewport"
        onPointerDown={(event) => {
          pausedRef.current = true;
          touchStartX.current = event.clientX;
        }}
        onPointerUp={(event) => {
          const start = touchStartX.current;
          touchStartX.current = null;
          pausedRef.current = false;
          if (start == null) return;
          const dx = event.clientX - start;
          if (Math.abs(dx) < 40) return;
          goTo(indexRef.current + (dx < 0 ? 1 : -1));
        }}
      >
        <div
          className="profile-insight-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="profile-insight-slide-wrap">
              {slide.node}
            </div>
          ))}
        </div>
      </div>
      <div className="profile-insight-dots">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Slide ${i + 1}`}
            className={i === index ? 'is-on' : undefined}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
