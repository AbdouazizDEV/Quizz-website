type NotifyPayload = { title: string; message: string };
type Listener = (payload: NotifyPayload) => void;

const listeners = new Set<Listener>();

/** Remplace `Alert.alert` du mobile par un toast / fallback natif. */
export function notifyUser(title: string, message: string): void {
  if (listeners.size === 0 && typeof window !== 'undefined') {
    window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }
  for (const listener of listeners) listener({ title, message });
}

export function subscribeNotify(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
