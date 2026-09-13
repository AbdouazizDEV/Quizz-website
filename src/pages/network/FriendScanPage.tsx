import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FriendQrScannerPanel } from '@components/ui/network/FriendQrScannerPanel';
import { StatisticsNavbar } from '@components/ui/statistics/StatisticsNavbar';
import { Routes } from '@constants/Routes';
import { useAuthMe } from '@hooks/useAuthMe';
import { notifyUser } from '@platform/notify';
import { useAppError } from '@providers/AppErrorProvider';
import { sendFriendInviteFromRawPayload } from '@services/network/friendInviteService';

export function FriendScanPage() {
  const navigate = useNavigate();
  const { showAppError } = useAppError();
  const { data: me } = useAuthMe();
  const [busy, setBusy] = useState(false);
  const myUserId = me?.user?.id?.trim() ?? '';

  const sendFriendRequest = useCallback(
    async (rawPayload: string) => {
      if (busy || !rawPayload.trim()) return;
      setBusy(true);
      try {
        const result = await sendFriendInviteFromRawPayload(rawPayload, myUserId || undefined);
        if (result.ok) {
          notifyUser('Demande envoyée', `Ta demande d’ami a été envoyée à ${result.profile.n}.`);
          navigate(Routes.HOME);
          return;
        }
        showAppError(result.message, {
          title: 'Scanner un ami',
          onRetry: result.code === 'api_error' ? () => void sendFriendRequest(rawPayload) : undefined,
        });
      } finally {
        setBusy(false);
      }
    },
    [busy, myUserId, navigate, showAppError],
  );

  return (
    <div className="network-page network-scan-page">
      <StatisticsNavbar title="Scanner un ami" onBack={() => navigate(Routes.HOME)} />
      <FriendQrScannerPanel busy={busy} onScan={(payload) => void sendFriendRequest(payload)} />
    </div>
  );
}
