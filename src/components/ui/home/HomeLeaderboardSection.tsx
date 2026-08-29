export interface HomeLeaderboardUser {
  id: string;
  name: string;
  points: number;
  avatar?: string;
  rank?: number;
}

interface HomeLeaderboardSectionProps {
  users: HomeLeaderboardUser[];
  onPressAvatar?: (userId: string) => void;
}

export function HomeLeaderboardSection({ users, onPressAvatar }: HomeLeaderboardSectionProps) {
  if (users.length === 0) {
    return (
      <div className="home-rank-card">
        <p className="home-rank-empty">Aucun score disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="home-rank-card">
      {users.map((user, index) => {
        const position = user.rank ?? index + 1;
        return (
          <div key={user.id} className="home-rank-row">
            <div className="home-rank-left">
              <span className="home-rank-index">{position}</span>
              <button
                type="button"
                className="home-rank-avatar"
                onClick={() => onPressAvatar?.(user.id)}
                aria-label={user.name}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="" />
                ) : (
                  user.name[0]?.toUpperCase() ?? '?'
                )}
              </button>
              <span className="home-rank-name">{user.name}</span>
            </div>
            <span className="home-rank-points">{user.points} pts</span>
          </div>
        );
      })}
    </div>
  );
}
