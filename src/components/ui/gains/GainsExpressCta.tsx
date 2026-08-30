import { useNavigate } from 'react-router-dom';

import { Icon } from '@components/ui/Icon';
import { Routes } from '@constants/Routes';

interface GainsExpressCtaProps {
  onPress?: () => void;
}

export function GainsExpressCta({ onPress }: GainsExpressCtaProps) {
  const navigate = useNavigate();

  return (
    <div className="gains-fade" style={{ animationDelay: '60ms' }}>
      <button
        type="button"
        className="gains-express"
        onClick={() => (onPress ? onPress() : navigate(Routes.CATEGORIES))}
      >
        <span className="gains-express-icon">
          <Icon name="zap" size={22} color="#1F2347" />
        </span>
        <span className="gains-express-copy">
          <strong>Quiz Express</strong>
          <span>Joue vite, gagne des points maintenant</span>
        </span>
        <Icon name="arrow-right" size={20} color="#1F2347" />
      </button>
    </div>
  );
}
