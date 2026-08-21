import type { ComponentProps } from 'react';
import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';
import {
  Award,
  Bell,
  ChartNoAxesColumn,
  CircleCheck,
  CircleX,
  Clock,
  Flag,
  UserPlus,
  Zap,
} from 'lucide-react';

type LucideIcon = ForwardRefExoticComponent<
  Omit<SVGProps<SVGSVGElement>, 'ref'> & RefAttributes<SVGSVGElement> & { size?: number | string }
>;

type IconName =
  | 'user-plus'
  | 'zap'
  | 'check-circle'
  | 'x-circle'
  | 'award'
  | 'bell'
  | 'clock'
  | 'flag'
  | 'bar-chart-2';

export interface NotificationVisual {
  icon: IconName;
  Icon: LucideIcon;
  iconBackground: string;
  iconColor: string;
  accent: string;
}

const ICONS: Record<IconName, LucideIcon> = {
  'user-plus': UserPlus,
  zap: Zap,
  'check-circle': CircleCheck,
  'x-circle': CircleX,
  award: Award,
  bell: Bell,
  clock: Clock,
  flag: Flag,
  'bar-chart-2': ChartNoAxesColumn,
};

export function getNotificationVisual(type: string): NotificationVisual {
  const base = (icon: IconName, iconBackground: string, iconColor: string, accent: string): NotificationVisual => ({
    icon,
    Icon: ICONS[icon],
    iconBackground,
    iconColor,
    accent,
  });

  switch (type) {
    case 'friend_request':
      return base('user-plus', '#E8F5E9', '#2E7D32', '#43A047');
    case 'duel_request':
      return base('zap', '#FFF3E0', '#F57C00', '#FFB703');
    case 'duel_accepted':
      return base('check-circle', '#E3F2FD', '#1565C0', '#1F2261');
    case 'duel_declined':
      return base('x-circle', '#FFEBEE', '#C62828', '#E53935');
    case 'duel_completed':
      return base('award', '#FFF8E1', '#F9A825', '#FFB703');
    case 'duel_score':
      return base('bell', '#F3E5F5', '#8E24AA', '#7B1FA2');
    case 'streak_reminder':
      return base('clock', '#FFF3E0', '#EF6C00', '#FF7A4D');
    case 'challenge_new':
      return base('flag', '#E8F5E9', '#2E7D32', '#43A047');
    case 'ranking_update':
      return base('bar-chart-2', '#E3F2FD', '#1565C0', '#1F2261');
    case 'admin_notice':
      return base('bell', '#FCE4EC', '#D81B60', '#AD1457');
    default:
      return base('bell', '#F3E5F5', '#8E24AA', '#7B1FA2');
  }
}

export function formatNotificationTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'À l’instant';
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days} j`;
  return date.toLocaleDateString('fr-FR');
}

export type { ComponentProps };
