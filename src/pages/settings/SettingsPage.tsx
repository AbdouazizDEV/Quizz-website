import { Link, useNavigate } from 'react-router-dom';
import { Routes } from '@constants/Routes';
import { ABOUT_APP_NAME, ABOUT_DESCRIPTION, ABOUT_FEATURES, ABOUT_TAGLINE } from '@constants/aboutContent';
import { HELP_FAQ_ENTRIES } from '@constants/helpCenterContent';
import { QUIZ_SOUND_CATALOG } from '@constants/quizSoundCatalog';
import { QUIZ_SOUND_SLOT_META } from '@constants/quizSoundSlots';
import { getSettingsMenuEntries } from '@services/settings/settingsMenuRegistry';
import { signOutAndSyncStore } from '@services/auth/authSessionController';
import { previewQuizSound } from '@services/quiz/play/playQuizSoundForSlot';
import { usePersonalInfo } from '@hooks/usePersonalInfo';
import { useNotifications } from '@hooks/useNotifications';
import { useSettingsStore } from '@stores/settingsStore';
import { useQuizSoundPreferencesStore } from '@stores/quizSoundPreferencesStore';
import { Icon } from '@components/ui/Icon';

export function SettingsPage() {
  const navigate = useNavigate();
  const darkMode = useSettingsStore((s) => s.darkMode);
  const setDarkMode = useSettingsStore((s) => s.setDarkMode);

  return (
    <div>
      <h1>Paramètres</h1>
      {getSettingsMenuEntries().map((entry) => {
        if (entry.kind === 'toggle') {
          return (
            <button key={entry.id} type="button" className="card" style={{ padding: 14, width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: 8, background: '#fff' }} onClick={() => setDarkMode(!darkMode)}>
              <span><Icon name={entry.icon} /> {entry.label}</span>
              <strong>{darkMode ? 'On' : 'Off'}</strong>
            </button>
          );
        }
        if (entry.kind === 'logout') {
          return (
            <button key={entry.id} type="button" className="btn btn-ghost" style={{ width: '100%', marginTop: 12 }} onClick={async () => { await signOutAndSyncStore(); navigate(Routes.LOGIN, { replace: true }); }}>
              {entry.label}
            </button>
          );
        }
        return (
          <Link key={entry.id} to={entry.href} className="card" style={{ padding: 14, display: 'flex', gap: 10, marginBottom: 8 }}>
            <Icon name={entry.icon} /> {entry.label}
          </Link>
        );
      })}
    </div>
  );
}

export function PersonalInfoPage() {
  const { form, loading, saving, error, saved, updateField, save } = usePersonalInfo();
  if (loading || !form) return <p>Chargement…</p>;
  return (
    <div>
      <h1>Informations personnelles</h1>
      {(['fullName', 'username', 'phone', 'bio'] as const).map((key) => (
        <label key={key} className="field" style={{ marginBottom: 16 }}>
          <span>{key}</span>
          <input value={form[key]} onChange={(e) => updateField(key, e.target.value)} />
        </label>
      ))}
      {error ? <p className="error-text">{error.message}</p> : null}
      {saved ? <p>Enregistré.</p> : null}
      <button type="button" className="btn btn-primary" onClick={() => void save()} disabled={saving}>
        {saving ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </div>
  );
}

export function NotificationsPage() {
  const { items, loading, markRead, markAllRead, remove } = useNotifications();
  return (
    <div>
      <h1>Notifications</h1>
      <button type="button" className="btn btn-ghost" onClick={() => void markAllRead()}>Tout marquer lu</button>
      {loading ? <p>Chargement…</p> : null}
      {items.map((n) => (
        <article key={n.id} className="card" style={{ padding: 14, margin: '10px 0', opacity: n.isRead ? 0.7 : 1 }}>
          <strong>{n.title}</strong>
          <p className="muted">{n.body}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn btn-outline" onClick={() => void markRead(n.id)}>Lu</button>
            <button type="button" className="btn btn-ghost" onClick={() => void remove(n.id)}>Supprimer</button>
          </div>
        </article>
      ))}
    </div>
  );
}

export function MusicPage() {
  const musicEnabled = useSettingsStore((s) => s.musicEnabled);
  const setMusicEnabled = useSettingsStore((s) => s.setMusicEnabled);
  const sounds = useQuizSoundPreferencesStore((s) => s.sounds);
  const setSoundForSlot = useQuizSoundPreferencesStore((s) => s.setSoundForSlot);

  return (
    <div>
      <h1>Musique et effets</h1>
      <button type="button" className="btn btn-ghost" onClick={() => setMusicEnabled(!musicEnabled)}>
        Sons : {musicEnabled ? 'activés' : 'coupés'}
      </button>
      {QUIZ_SOUND_SLOT_META.map((slot) => (
        <label key={slot.slot} className="field" style={{ marginTop: 16 }}>
          <span>{slot.title}</span>
          <select value={sounds[slot.slot]} onChange={(e) => setSoundForSlot(slot.slot, e.target.value)}>
            {QUIZ_SOUND_CATALOG.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          <button type="button" className="btn btn-outline" style={{ marginTop: 8 }} onClick={() => void previewQuizSound(sounds[slot.slot])}>
            Écouter
          </button>
        </label>
      ))}
    </div>
  );
}

export function SecurityPage() {
  return (
    <div>
      <h1>Sécurité</h1>
      <p>L’accès au compte se fait par passkey (WebAuthn). Aucun mot de passe n’est requis.</p>
    </div>
  );
}

export function HelpPage() {
  return (
    <div>
      <h1>Centre d’aide</h1>
      {HELP_FAQ_ENTRIES.map((f) => (
        <article key={f.id} className="card" style={{ padding: 16, marginBottom: 10 }}>
          <strong>{f.question}</strong>
          <p className="muted">{f.answer}</p>
        </article>
      ))}
    </div>
  );
}

export function AboutPage() {
  return (
    <div>
      <h1>{ABOUT_APP_NAME}</h1>
      <p>{ABOUT_TAGLINE}</p>
      <p className="muted">{ABOUT_DESCRIPTION}</p>
      {ABOUT_FEATURES.map((f) => (
        <article key={f.id} className="card" style={{ padding: 16, marginTop: 12 }}>
          <strong>{f.title}</strong>
          <p className="muted">{f.body}</p>
        </article>
      ))}
    </div>
  );
}
