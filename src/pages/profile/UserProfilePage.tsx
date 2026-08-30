import { Navigate, useParams } from 'react-router-dom';

import { Routes } from '@constants/Routes';

import { ProfileView } from './ProfileView';

export function UserProfilePage() {
  const { userId } = useParams();
  const id = userId?.trim();
  if (!id) return <Navigate to={Routes.PROFILE} replace />;
  return <ProfileView userId={id} />;
}
