import { AppConfig } from '@config';
import { notifyUser } from '@platform/notify';
import {
  encodeFriendInviteWebLink,
  encodeFriendQrDeepLink,
  type FriendQrProfile,
} from '@utils/friendQrPayload';

export async function shareFriendProfile(profile: FriendQrProfile): Promise<void> {
  const webLink = encodeFriendInviteWebLink(profile, AppConfig.INVITE_WEB_BASE_URL);
  const deepLink = encodeFriendQrDeepLink(profile);
  const message = `Ajoute-moi sur Quizz+ ! Ouvre ce lien pour m’ajouter :\n${webLink}`;

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: 'Mon profil Quizz+',
        text: message,
        url: webLink,
      });
      return;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
    }
  }

  try {
    await navigator.clipboard.writeText(webLink);
    notifyUser('Lien copié', 'Le lien de ton profil a été copié dans le presse-papiers.');
  } catch {
    notifyUser('Partage', `${message}\n${deepLink}`);
  }
}
