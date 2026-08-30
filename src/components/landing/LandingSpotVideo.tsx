import { useEffect, useRef, useState } from 'react';

export const ABOUT_SPOT_VIDEO_URL =
  'https://res.cloudinary.com/dhivn2ahm/video/upload/v1788049321/WhatsApp_Video_2026-08-30_at_00.19.59_gafndb.mp4';

type LandingSpotVideoProps = {
  label: string;
  liveLabel: string;
  brandLeft: string;
  brandRight: string;
};

export function LandingSpotVideo({ label, liveLabel, brandLeft, brandRight }: LandingSpotVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!stage || !video) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          void video.play().catch(() => {
            /* autoplay peut être bloqué ; loop reste prêt */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = muted;
  }, [muted]);

  return (
    <div ref={stageRef} className="lp-spot">
      <div className="lp-spot-glow" aria-hidden />
      <div className="lp-spot-frame">
        <div className="lp-spot-bezel">
          <span className="lp-spot-live">
            <i />
            {liveLabel}
          </span>
          <div className="lp-spot-brands" aria-hidden>
            <span>{brandLeft}</span>
            <span>{brandRight}</span>
          </div>
          <button
            type="button"
            className="lp-spot-sound"
            onClick={() => setMuted((v) => !v)}
            aria-label={muted ? 'Activer le son' : 'Couper le son'}
          >
            {muted ? 'Son off' : 'Son on'}
          </button>
          <video
            ref={videoRef}
            className="lp-spot-video"
            src={ABOUT_SPOT_VIDEO_URL}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={label}
          />
          <div className="lp-spot-shine" aria-hidden />
          <div className="lp-spot-vignette" aria-hidden />
        </div>
      </div>
    </div>
  );
}
