import { HOME_ACTION_TILES, type HomeActionTileId } from '@constants/homeActionTiles';
import { Icon } from '@components/ui/Icon';

interface HomeActionTilesProps {
  onTilePress?: (tileId: HomeActionTileId) => void;
  pulseIds?: Partial<Record<HomeActionTileId, boolean>>;
}

export function HomeActionTiles({ onTilePress, pulseIds }: HomeActionTilesProps) {
  return (
    <div className="home-tiles">
      {HOME_ACTION_TILES.map((tile) => (
        <button
          key={tile.id}
          type="button"
          className="home-tile"
          data-pulse={pulseIds?.[tile.id] ? 'true' : 'false'}
          aria-label={tile.title}
          onClick={() => onTilePress?.(tile.id)}
        >
          <span className="home-tile-icon">
            <Icon name={tile.icon} size={20} color="#F5A623" />
          </span>
          <span className="home-tile-title">{tile.title}</span>
          <span className="home-tile-badge">{tile.badge}</span>
        </button>
      ))}
    </div>
  );
}
