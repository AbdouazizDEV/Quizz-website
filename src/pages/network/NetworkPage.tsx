import { Link, useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useAuthMe } from '@hooks/useAuthMe';
import { useConnectionsScreenData } from '@hooks/useConnectionsScreenData';
import { useGlobalLeaderboard } from '@hooks/useGlobalLeaderboard';
import { Routes } from '@constants/Routes';
import { AppConfig } from '@config';
import { encodeFriendInviteWebLink } from '@utils/friendQrPayload';
import { sendFriendInviteFromRawPayload } from '@services/network/friendInviteService';
import { shareFriendProfile } from '@services/network/shareFriendProfile';
import { Icon } from '@components/ui/Icon';
import { useState } from 'react';

export function NetworkPage() {
  const [query, setQuery] = useState('');
  const { data, loading } = useConnectionsScreenData('friends', query);
  const { data: me } = useAuthMe();
  const profile = me?.profile;
  const qrValue = profile
    ? encodeFriendInviteWebLink(
        { v: 1, uid: me!.user.id, n: profile.username, s: profile.total_score, l: profile.level_code ?? 'Z0' },
        AppConfig.INVITE_WEB_BASE_URL,
      )
    : '';

  return (
    <div>
      <h1>Réseau</h1>
      <div className="card" style={{ padding: 16, textAlign: 'center' }}>
        {qrValue ? <QRCodeSVG value={qrValue} size={180} /> : null}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
          <Link to={Routes.FRIEND_SCAN} className="btn btn-ghost"><Icon name="scan-line" /> Scanner</Link>
          {profile ? (
            <button type="button" className="btn btn-outline" onClick={() => void shareFriendProfile({ v: 1, uid: me!.user.id, n: profile.username, s: profile.total_score, l: profile.level_code ?? 'Z0' })}>
              Partager
            </button>
          ) : null}
        </div>
      </div>
      <input className="field" style={{ margin: '16px 0' }} placeholder="Rechercher" value={query} onChange={(e) => setQuery(e.target.value)} />
      {loading ? <p>Chargement…</p> : null}
      {data?.items.map((u) => (
        <Link key={u.id} to={`/users/${u.id}`} className="card" style={{ padding: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
          <span>{u.displayName}</span>
          <span className="muted">{u.handle}</span>
        </Link>
      ))}
    </div>
  );
}

export function PlayersPage() {
  const { items, loading } = useGlobalLeaderboard(40);
  return (
    <div>
      <h1>Joueurs</h1>
      {loading ? <p>Chargement…</p> : null}
      {items.map((p) => (
        <Link key={p.id} to={`/users/${p.id}`} className="card" style={{ padding: 12, marginBottom: 8, display: 'block' }}>
          #{p.rank} {p.displayName}
        </Link>
      ))}
    </div>
  );
}

export function FriendInvitePage() {
  const [params] = useSearchParams();
  const token = params.get('d') ?? '';
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div>
      <h1>Invitation ami</h1>
      <p className="muted">Token : {token || 'aucun'}</p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={async () => {
          const res = await sendFriendInviteFromRawPayload(token);
          setMessage(res.ok ? `Demande envoyée à ${res.profile.n}` : res.message);
        }}
      >
        Envoyer la demande
      </button>
      {message ? <p>{message}</p> : null}
    </div>
  );
}

export function FriendScanPage() {
  const [raw, setRaw] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  return (
    <div>
      <h1>Scanner un QR</h1>
      <p className="muted">Colle le lien d’invitation si la caméra n’est pas disponible.</p>
      <label className="field">
        <span>Lien ou payload</span>
        <input value={raw} onChange={(e) => setRaw(e.target.value)} />
      </label>
      <button
        type="button"
        className="btn btn-primary"
        style={{ marginTop: 16 }}
        onClick={async () => {
          const res = await sendFriendInviteFromRawPayload(raw);
          setMessage(res.ok ? `Demande envoyée à ${res.profile.n}` : res.message);
        }}
      >
        Envoyer
      </button>
      {message ? <p>{message}</p> : null}
    </div>
  );
}
