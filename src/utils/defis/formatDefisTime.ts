export function formatEndsIn(iso: string | null | undefined, now = Date.now()): string {
  if (!iso) return '';
  const end = new Date(iso).getTime();
  if (!Number.isFinite(end)) return '';
  const diff = end - now;
  if (diff <= 0) return 'Terminé';
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  if (days > 0) return `Se termine dans ${days} j ${hours} h`;
  if (hours > 0) return `Se termine dans ${hours} h ${mins} min`;
  return `Se termine dans ${Math.max(1, mins)} min`;
}

export function formatShortDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return '—';
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export function formatLongDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso.includes('T') ? iso : `${iso}T12:00:00`);
  if (!Number.isFinite(date.getTime())) return '—';
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function todayDateString(): string {
  return new Date().toISOString().split('T')[0] ?? '';
}
