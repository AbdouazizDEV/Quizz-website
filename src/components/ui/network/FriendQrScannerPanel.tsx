import { useId, useState } from 'react';

import { useFriendQrCameraScanner } from '@hooks/useFriendQrCameraScanner';

interface FriendQrScannerPanelProps {
  busy: boolean;
  onScan: (payload: string) => void;
}

export function FriendQrScannerPanel({ busy, onScan }: FriendQrScannerPanelProps) {
  const readerId = useId().replace(/:/g, '');
  const containerId = `friend-qr-reader-${readerId}`;
  const [manualLink, setManualLink] = useState('');

  const { status, errorMessage } = useFriendQrCameraScanner({
    containerId,
    enabled: !busy,
    onDetected: onScan,
  });

  const cameraReady = status === 'ready';
  const cameraStarting = status === 'starting';

  return (
    <div className="friend-scan-panel">
      <div className="friend-scan-camera-wrap">
        <div id={containerId} className="friend-scan-camera" aria-label="Aperçu caméra" />
        {cameraStarting ? (
          <div className="friend-scan-camera-overlay">
            <div className="defis-spinner is-primary" />
            <p>Activation de la caméra…</p>
          </div>
        ) : null}
        {cameraReady ? <div className="friend-scan-frame" aria-hidden /> : null}
        {cameraReady ? (
          <p className="friend-scan-hint">
            {busy ? 'QR détecté, envoi en cours…' : 'Place le QR code Quizz+ de ton ami dans le cadre'}
          </p>
        ) : null}
        {errorMessage ? (
          <div className="friend-scan-camera-fallback">
            <p className="friend-scan-camera-error">{errorMessage}</p>
            <p className="network-muted">
              Utilise le champ ci-dessous pour coller le lien d’invitation.
            </p>
          </div>
        ) : null}
      </div>

      <div className="friend-scan-manual">
        <p className="friend-scan-manual-title">Lien ou payload</p>
        <p className="network-muted">Colle le lien si la caméra n’est pas disponible.</p>
        <label className="network-field">
          <span className="sr-only">Lien d’invitation</span>
          <input
            value={manualLink}
            onChange={(event) => setManualLink(event.target.value)}
            placeholder="https://quizzp.com/friend?d=..."
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </label>
        <button
          type="button"
          className="network-utility-cta"
          disabled={busy || !manualLink.trim()}
          onClick={() => onScan(manualLink.trim())}
        >
          {busy ? 'Envoi…' : 'Envoyer'}
        </button>
      </div>
    </div>
  );
}
