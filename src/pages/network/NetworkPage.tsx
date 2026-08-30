import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import type { ConnectionFilter, ConnectionUser } from '@app-types/network.types';
import { ConnectionListItem } from '@components/ui/network/ConnectionListItem';
import { NetworkFilterTabs } from '@components/ui/network/NetworkFilterTabs';
import { NetworkSearchNavBar } from '@components/ui/network/NetworkSearchNavBar';
import { StatisticsNavbar } from '@components/ui/statistics/StatisticsNavbar';
import { buildUserProfileHref, Routes } from '@constants/Routes';
import { useConnectionsScreenData } from '@hooks/useConnectionsScreenData';
import { useAppError } from '@providers/AppErrorProvider';
import { getConnectionFollowService } from '@services/network/connectionFollowServiceInstance';
import { sendFriendInviteFromRawPayload } from '@services/network/friendInviteService';

export function NetworkPage() {
  const navigate = useNavigate();
  const { showAppError } = useAppError();
  const [filter, setFilter] = useState<ConnectionFilter>('friends');
  const [relationshipOverrides, setRelationshipOverrides] = useState<Record<string, boolean>>({});
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const { data, loading, loadingMore, error, refetch, loadMore } = useConnectionsScreenData(
    filter,
    searchQuery,
  );

  useEffect(() => {
    if (!error) return;
    showAppError('Impossible de charger vos connexions. Vérifiez votre connexion.', {
      title: 'Réseau',
      onRetry: () => void refetch(),
    });
  }, [error, refetch, showAppError]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !data?.hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) void loadMore();
      },
      { rootMargin: '120px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [data?.hasMore, loadMore, data?.items.length]);

  const onBack = useCallback(() => {
    if (searchMode) {
      setSearchMode(false);
      setSearchQuery('');
      return;
    }
    if (window.history.length > 1) navigate(-1);
    else navigate(Routes.PROFILE, { replace: true });
  }, [navigate, searchMode]);

  const onChangeFilter = useCallback((next: ConnectionFilter) => {
    setRelationshipOverrides({});
    setFilter(next);
  }, []);

  const effectiveRelationship = useCallback(
    (user: ConnectionUser) => relationshipOverrides[user.id] ?? user.relationshipIsActive,
    [relationshipOverrides],
  );

  const onToggleFollow = useCallback(
    async (user: ConnectionUser) => {
      const next = !effectiveRelationship(user);
      setRelationshipOverrides((prev) => ({ ...prev, [user.id]: next }));
      try {
        await getConnectionFollowService().setFollowing(user.id, next);
        void refetch();
      } catch {
        setRelationshipOverrides((prev) => {
          const nextMap = { ...prev };
          delete nextMap[user.id];
          return nextMap;
        });
        showAppError('Impossible de mettre à jour le suivi.', { title: 'Réseau' });
      }
    },
    [effectiveRelationship, refetch, showAppError],
  );

  const list = data?.items ?? [];
  const emptyLabel = useMemo(() => {
    const q = searchQuery.trim();
    if (q.length > 0) return `Aucun utilisateur ne correspond à « ${q} ».`;
    return 'Aucun utilisateur trouvé.';
  }, [searchQuery]);

  return (
    <div className="network-page">
      {loading && !data ? (
        <div className="network-centered" role="status" aria-label="Chargement">
          <div className="network-spinner" />
        </div>
      ) : null}

      {error && !data ? (
        <div className="network-centered">
          <p className="network-error">Impossible de charger les connexions.</p>
          <button type="button" className="network-retry" onClick={() => void refetch()}>
            Réessayer
          </button>
        </div>
      ) : null}

      {data ? (
        <>
          <div className="network-header">
            {searchMode ? (
              <NetworkSearchNavBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClose={() => {
                  setSearchMode(false);
                  setSearchQuery('');
                }}
              />
            ) : (
              <StatisticsNavbar
                title={data.viewerDisplayName}
                onBack={onBack}
                onSearch={() => setSearchMode(true)}
              />
            )}
            <NetworkFilterTabs active={filter} onChange={onChangeFilter} />
          </div>

          {list.length === 0 ? (
            <p className="network-empty">{emptyLabel}</p>
          ) : (
            <div className="network-list">
              {list.map((user) => (
                <ConnectionListItem
                  key={user.id}
                  user={user}
                  relationshipActive={effectiveRelationship(user)}
                  onToggleFollow={() => void onToggleFollow(user)}
                  onPressAvatar={() => navigate(buildUserProfileHref(user.id))}
                />
              ))}
            </div>
          )}

          {loadingMore ? (
            <div className="network-footer-loader" role="status" aria-label="Chargement">
              <div className="network-spinner is-sm" />
            </div>
          ) : null}
          <div ref={sentinelRef} className="network-sentinel" aria-hidden />
        </>
      ) : null}
    </div>
  );
}

export function FriendInvitePage() {
  const [params] = useSearchParams();
  const token = params.get('d') ?? '';
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="network-page network-utility-page">
      <h1>Invitation ami</h1>
      <p className="network-muted">Token : {token || 'aucun'}</p>
      <button
        type="button"
        className="network-utility-cta"
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
    <div className="network-page network-utility-page">
      <h1>Scanner un QR</h1>
      <p className="network-muted">Colle le lien d’invitation si la caméra n’est pas disponible.</p>
      <label className="network-field">
        <span>Lien ou payload</span>
        <input value={raw} onChange={(event) => setRaw(event.target.value)} />
      </label>
      <button
        type="button"
        className="network-utility-cta"
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
