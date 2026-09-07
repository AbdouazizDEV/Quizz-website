import { Navigate, Route, Routes as R } from 'react-router-dom';
import { AppShell } from './layouts/AppShell';
import { GuestRoute, ProtectedRoute } from './layouts/Guards';
import { SplashPage } from '@pages/SplashPage';
import { LandingPage } from '@pages/LandingPage';
import { WalkthroughPage } from '@pages/auth/WalkthroughPage';
import { LoginPage } from '@pages/auth/LoginPage';
import { GoogleCallbackPage } from '@pages/auth/GoogleCallbackPage';
import { RegisterPage } from '@pages/auth/RegisterPage';
import { CreateAccountTypePage } from '@pages/auth/CreateAccountTypePage';
import { CreateAccountWorkplacePage } from '@pages/auth/CreateAccountWorkplacePage';
import { CreateAccountProfilePage } from '@pages/auth/CreateAccountProfilePage';
import { ForgotPasswordPage } from '@pages/auth/ForgotPasswordPage';
import { HomePage } from '@pages/home/HomePage';
import { CategoriesPage } from '@pages/quiz/CategoriesPage';
import { CategoryDetailPage } from '@pages/quiz/CategoryDetailPage';
import { QuizEntryPage } from '@pages/quiz/QuizEntryPage';
import { QuizPlayPage } from '@pages/quiz/QuizPlayPage';
import { QuizCongratsPage } from '@pages/quiz/QuizCongratsPage';
import { DefisHubPage } from '@pages/defis/DefisHubPage';
import { ChallengeListPage } from '@pages/defis/ChallengeListPage';
import { ChallengeDetailPage } from '@pages/defis/ChallengeDetailPage';
import { ChallengeLeaderboardPage } from '@pages/defis/ChallengeLeaderboardPage';
import { DuelHubPage } from '@pages/defis/DuelHubPage';
import { DuelFriendsPage } from '@pages/defis/DuelFriendsPage';
import { DuelPendingPage } from '@pages/defis/DuelPendingPage';
import { DuelRecentPage } from '@pages/defis/DuelRecentPage';
import { DuelDetailPage } from '@pages/defis/DuelDetailPage';
import { DuelResultPage } from '@pages/defis/DuelResultPage';
import { TournoiListPage } from '@pages/defis/TournoiListPage';
import { TournoiDetailPage } from '@pages/defis/TournoiDetailPage';
import { TournoiBracketPage } from '@pages/defis/TournoiBracketPage';
import { GainsHubPage } from '@pages/gains/GainsHubPage';
import { GainsHowPage } from '@pages/gains/GainsHowPage';
import { GainsPrizesPage } from '@pages/gains/GainsPrizesPage';
import { GainsRewardsPage } from '@pages/gains/GainsRewardsPage';
import { GainsMyPage } from '@pages/gains/GainsMyPage';
import { ProfilePage } from '@pages/profile/ProfilePage';
import { UserProfilePage } from '@pages/profile/UserProfilePage';
import { StatisticsPage } from '@pages/profile/StatisticsPage';
import { ScoreboardPage } from '@pages/profile/ScoreboardPage';
import { NetworkPage } from '@pages/network/NetworkPage';
import { FriendInvitePage } from '@pages/network/FriendInvitePage';
import { FriendScanPage } from '@pages/network/FriendScanPage';
import { SettingsPage } from '@pages/settings/SettingsPage';
import { PersonalInfoPage } from '@pages/settings/PersonalInfoPage';
import { NotificationsPage } from '@pages/settings/NotificationsPage';
import { MusicPage } from '@pages/settings/MusicPage';
import { SecurityPage } from '@pages/settings/SecurityPage';
import { HelpPage } from '@pages/settings/HelpPage';
import { AboutPage } from '@pages/settings/AboutPage';
import { PremiumPage } from '@pages/premium/PremiumPage';
import { PremiumComparePage } from '@pages/premium/PremiumComparePage';
import { PremiumPlansPage } from '@pages/premium/PremiumPlansPage';
import { PremiumPaymentPage } from '@pages/premium/PremiumPaymentPage';
import { PremiumSuccessPage } from '@pages/premium/PremiumSuccessPage';
import { PrivacyPolicyPage } from '@pages/legal/PrivacyPolicyPage';
import { TermsOfServicePage } from '@pages/legal/TermsOfServicePage';

export function AppRoutes() {
  return (
    <R>
      <Route path="/" element={<SplashPage />} />
      <Route path="/auth/callback" element={<GoogleCallbackPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsOfServicePage />} />
      <Route element={<GuestRoute />}>
        <Route path="/accueil" element={<LandingPage />} />
        <Route path="/walkthrough" element={<WalkthroughPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create-account-type" element={<CreateAccountTypePage />} />
        <Route path="/create-account-workplace" element={<CreateAccountWorkplacePage />} />
        <Route path="/create-account-profile" element={<CreateAccountProfilePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/forgot-password/otp" element={<ForgotPasswordPage />} />
        <Route path="/forgot-password/new-password" element={<ForgotPasswordPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:slug" element={<CategoryDetailPage />} />
          <Route path="/defis" element={<DefisHubPage />} />
          <Route path="/defis/challenge" element={<ChallengeListPage />} />
          <Route path="/defis/challenge/:id/classement" element={<ChallengeLeaderboardPage />} />
          <Route path="/defis/challenge/classement/:id" element={<ChallengeLeaderboardPage />} />
          <Route path="/defis/challenge/:id" element={<ChallengeDetailPage />} />
          <Route path="/defis/duel" element={<DuelHubPage />} />
          <Route path="/defis/duel/amis" element={<DuelFriendsPage />} />
          <Route path="/defis/duel/en-attente" element={<DuelPendingPage />} />
          <Route path="/defis/duel/recents" element={<DuelRecentPage />} />
          <Route path="/defis/duel/:id/resultat" element={<DuelResultPage />} />
          <Route path="/defis/duel/resultat/:id" element={<DuelResultPage />} />
          <Route path="/defis/duel/:id" element={<DuelDetailPage />} />
          <Route path="/defis/tournoi" element={<TournoiListPage />} />
          <Route path="/defis/tournoi/:id/bracket" element={<TournoiBracketPage />} />
          <Route path="/defis/tournoi/bracket/:id" element={<TournoiBracketPage />} />
          <Route path="/defis/tournoi/:id" element={<TournoiDetailPage />} />
          <Route path="/gains" element={<GainsHubPage />} />
          <Route path="/gains/comment-gagner" element={<GainsHowPage />} />
          <Route path="/gains/prix" element={<GainsPrizesPage />} />
          <Route path="/gains/recompenses" element={<GainsRewardsPage />} />
          <Route path="/gains/mes-gains" element={<GainsMyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/users/:userId" element={<UserProfilePage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/scoreboard" element={<ScoreboardPage />} />
          <Route path="/players" element={<ScoreboardPage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/friend" element={<FriendInvitePage />} />
          <Route path="/friend-scan" element={<FriendScanPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/personal-info" element={<PersonalInfoPage />} />
          <Route path="/settings/notifications" element={<NotificationsPage />} />
          <Route path="/settings/music" element={<MusicPage />} />
          <Route path="/settings/security" element={<SecurityPage />} />
          <Route path="/settings/help" element={<HelpPage />} />
          <Route path="/settings/about" element={<AboutPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/premium/compare" element={<PremiumComparePage />} />
          <Route path="/premium/plans" element={<PremiumPlansPage />} />
          <Route path="/premium/payment" element={<PremiumPaymentPage />} />
          <Route path="/premium/success" element={<PremiumSuccessPage />} />
        </Route>
        <Route path="/quiz/:quizId" element={<QuizEntryPage />} />
        <Route path="/quiz/:quizId/play" element={<QuizPlayPage />} />
        <Route path="/quiz/:quizId/congrats" element={<QuizCongratsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </R>
  );
}
