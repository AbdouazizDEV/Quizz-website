import { HOME_ACTION_TILES, type HomeActionTileId } from '@constants/homeActionTiles';
import { Icon } from '@components/ui/Icon';

interface DefisActionTilesProps {
  onTilePress?: (tileId: HomeActionTileId) => void;
  pulseIds?: Partial<Record<HomeActionTileId, boolean>>;
}

export function DefisActionTiles({ onTilePress, pulseIds }: DefisActionTilesProps) {
  return (
    <div className="defis-tiles">
      {HOME_ACTION_TILES.map((tile, index) => (
        <button
          key={tile.id}
          type="button"
          className="defis-tile"
          data-pulse={pulseIds?.[tile.id] ? 'true' : 'false'}
          style={{ animationDelay: `${120 + index * 80}ms` }}
          aria-label={tile.title}
          onClick={() => onTilePress?.(tile.id)}
        >
          <span className="defis-tile-icon">
            <Icon name={tile.icon} size={20} color="#1A1A2E" />
          </span>
          <span className="defis-tile-copy">
            <strong>{tile.title}</strong>
            <em>{tile.badge}</em>
          </span>
        </button>
      ))}
    </div>
  );
}
