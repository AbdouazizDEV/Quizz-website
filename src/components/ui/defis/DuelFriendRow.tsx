import type { DuelFriendResult } from '@services/defis/duelFriendsSearch';

interface DuelFriendRowProps {
  friend: DuelFriendResult;
  onChallenge: () => void;
}

export function DuelFriendRow({ friend, onChallenge }: DuelFriendRowProps) {
  return (
    <div className="duel-friend-row">
      <img className="duel-friend-avatar" src={friend.avatarUri} alt="" />
      <div className="duel-friend-info">
        <strong className="duel-friend-name">{friend.displayName}</strong>
        <span className="duel-friend-handle">{friend.handle}</span>
      </div>
      <button type="button" className="duel-friend-challenge" onClick={onChallenge}>
        Défier
      </button>
    </div>
  );
}
