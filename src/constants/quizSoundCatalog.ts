export interface QuizSoundCatalogEntry {
  id: string;
  label: string;
  fileName: string;
  src: string;
}

function soundSrc(fileName: string): string {
  return `/assets/sounds/${encodeURIComponent(fileName)}`;
}

export const QUIZ_SOUND_CATALOG: readonly QuizSoundCatalogEntry[] = [
  {
    id: 'alert-sound',
    label: 'Alerte',
    fileName: 'alert-sound_wTmioMp.mp3',
    src: soundSrc('alert-sound_wTmioMp.mp3'),
  },
  {
    id: 'core-sound-effect',
    label: 'Effet core',
    fileName: 'core-sound-effect.mp3',
    src: soundSrc('core-sound-effect.mp3'),
  },
  {
    id: 'faaah',
    label: 'Faaah',
    fileName: 'faaah.mp3',
    src: soundSrc('faaah.mp3'),
  },
  {
    id: 'gorilla-chant-remix',
    label: 'Gorilla chant remix',
    fileName: '🔥 Spotify Remixes Ep. 5.  Mbaku Maefa! Jabari Tribe Gorilla Chant Remix_MP3.mp3',
    src: soundSrc('🔥 Spotify Remixes Ep. 5.  Mbaku Maefa! Jabari Tribe Gorilla Chant Remix_MP3.mp3'),
  },
  {
    id: 'mi-gente',
    label: 'Mi gente (live edit)',
    fileName: 'mi-gente-sountec-live-edit.mp3',
    src: soundSrc('mi-gente-sountec-live-edit.mp3'),
  },
  {
    id: 'mixkit-police-whistle',
    label: 'Sifflet police',
    fileName: 'mixkit-police-whistle-614.wav',
    src: soundSrc('mixkit-police-whistle-614.wav'),
  },
  {
    id: 'omg',
    label: 'OMG',
    fileName: 'omg-oh-hell-nah-clean.mp3',
    src: soundSrc('omg-oh-hell-nah-clean.mp3'),
  },
  {
    id: 'quiz-wrong-alert',
    label: 'Alerte mauvaise réponse',
    fileName: 'quiz-wrong-alert.mp3',
    src: soundSrc('quiz-wrong-alert.mp3'),
  },
  {
    id: 'wakanda',
    label: 'Wakanda',
    fileName: 'wakanda.mp3',
    src: soundSrc('wakanda.mp3'),
  },
];

export type QuizSoundId = (typeof QUIZ_SOUND_CATALOG)[number]['id'];

const catalogById = new Map(QUIZ_SOUND_CATALOG.map((e) => [e.id, e]));

export function getQuizSoundById(id: string): QuizSoundCatalogEntry | undefined {
  return catalogById.get(id);
}

export function getQuizSoundLabel(id: string): string {
  return catalogById.get(id)?.label ?? id;
}
