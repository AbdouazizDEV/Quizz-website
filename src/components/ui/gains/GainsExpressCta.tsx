import { useNavigate } from 'react-router-dom';

import { Routes } from '@constants/Routes';
import { Icon } from '@components/ui/Icon';

export function GainsExpressCta() {
  const navigate = useNavigate();

  return (
    <button type="button" className="gains-express" onClick={() => navigate(Routes.CATEGORIES)}>
      <span className="gains-express-icon">
        <Icon name="zap" size={22} color="#1A1A2E" />
      </span>
      <span>
        <strong>Quiz Express</strong>
        <span>Joue vite, gagne des points maintenant</span>
      </span>
    </button>
  );
}
