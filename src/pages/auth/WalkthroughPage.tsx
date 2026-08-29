import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthShell } from '@components/ui/auth/AuthShell';
import { WalkthroughBottomBar } from '@components/ui/walkthrough/WalkthroughBottomBar';
import { WalkthroughCarousel } from '@components/ui/walkthrough/WalkthroughCarousel';
import { WalkthroughPagination } from '@components/ui/walkthrough/WalkthroughPagination';
import { Routes } from '@constants/Routes';
import { useAutoCarousel } from '@hooks/useAutoCarousel';
import type { WalkthroughSlide } from '@app-types/walkthrough.types';

const SLIDES: WalkthroughSlide[] = [
  {
    id: 'slide-1',
    title: 'Créez, partagez et jouez à des quiz quand et où vous le souhaitez',
    image: '/assets/icons/image1.png',
  },
  {
    id: 'slide-2',
    title: 'Trouvez des quiz amusants et intéressants pour améliorer vos connaissances',
    image: '/assets/icons/image2.png',
  },
  {
    id: 'slide-3',
    title: 'Jouez et relevez des défis de quiz avec vos amis.',
    image: '/assets/icons/image3.png',
  },
];

export function WalkthroughPage() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  useAutoCarousel({ itemCount: SLIDES.length, intervalMs: 3_000, setIndex: setActiveIndex });
  const current = SLIDES[activeIndex] ?? SLIDES[0];

  return (
    <AuthShell
      variant="walkthrough"
      artSrc={current.image}
      headline={current.title}
      subline="Le même Quizz+ que sur mobile, pensé pour le web."
      footer={
        <WalkthroughBottomBar
          onPressStart={() => navigate(Routes.CREATE_ACCOUNT_TYPE)}
          onPressSignin={() => navigate(Routes.LOGIN)}
        />
      }
    >
      <WalkthroughCarousel slides={SLIDES} activeIndex={activeIndex} />
      <WalkthroughPagination total={SLIDES.length} activeIndex={activeIndex} />
    </AuthShell>
  );
}
