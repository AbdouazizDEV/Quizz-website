import { useParams } from 'react-router-dom';

import { ProfileView } from './ProfileView';

export function UserProfilePage() {
  const { userId } = useParams();
  return <ProfileView userId={userId} />;
}
