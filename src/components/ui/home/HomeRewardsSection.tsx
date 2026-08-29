import { useNavigate } from 'react-router-dom';
import { Routes } from '@constants/Routes';
import { Icon } from '@components/ui/Icon';

export function HomeRewardsSection() {
  const navigate = useNavigate();

  return (
    <div className="home-rewards">
      <div className="home-rewards-top">
        <div>
          <p className="home-rewards-title">Tes gains t’attendent</p>
          <p className="home-rewards-sub">Classement, cash prizes, série bonus et Quiz Express.</p>
        </div>
        <Icon name="gift" size={24} color="#F5D24A" />
      </div>
      <button type="button" className="home-rewards-btn" onClick={() => navigate(Routes.GAINS)}>
        Voir mes gains
      </button>
    </div>
  );
}
