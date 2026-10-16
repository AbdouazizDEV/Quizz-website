import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BadgeGrid } from '@components/ui/badges/BadgeGrid';
import { Routes } from '@constants/Routes';
import { apiClient } from '@services/api/apiClient';

type Notebook = {
  open_count: number;
  categories: {
    category_name: string;
    open_count: number;
    mistakes: {
      question_id: string;
      question_text: string;
      your_answer: string | null;
      correct_answer: string | null;
      explanation: string | null;
      wrong_count: number;
    }[];
  }[];
};

type ReviewQuestion = {
  question_id: string;
  question_text: string;
  options: { id: string; label: string }[];
};

type Badge = { code: string; name: string; motif: string; how: string; earned: boolean; premiumOnly: boolean };
type StyleItem = { code: string; name: string; kind: 'frame' | 'theme' | 'avatar'; locked: boolean };

function apiError(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const message = (error as { response?: { data?: { error?: string } } }).response?.data?.error;
    if (message) return message;
  }
  return 'Action impossible pour le moment.';
}

export function CarnetPage() {
  const navigate = useNavigate();
  const [notebook, setNotebook] = useState<Notebook | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [styles, setStyles] = useState<StyleItem[]>([]);
  const [goal, setGoal] = useState<{ label: string; progress: number; target: number; reminder_enabled: boolean } | null>(null);
  const [stats, setStats] = useState<{ category_name: string; plays: number; open_mistakes: number }[]>([]);
  const [review, setReview] = useState<ReviewQuestion[] | null>(null);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const load = async () => {
    setNotice(null);
    try {
      const [book, badgeRes, styleRes, goalRes, statsRes] = await Promise.all([
        apiClient.get<Notebook>('/progression/notebook'),
        apiClient.get<{ badges: Badge[] }>('/progression/badges'),
        apiClient.get<{ catalog: StyleItem[] }>('/progression/style'),
        apiClient.get<{ label: string; progress: number; target: number; reminder_enabled: boolean }>('/progression/goal'),
        apiClient.get<{ categories: { category_name: string; plays: number; open_mistakes: number }[] }>('/progression/stats'),
      ]);
      setNotebook(book.data);
      setBadges(badgeRes.data.badges);
      setStyles(styleRes.data.catalog);
      setGoal(goalRes.data);
      setStats(statsRes.data.categories);
      setLocked(false);
    } catch (error) {
      const message = apiError(error);
      if (message.includes('réservé au Premium') || message.includes('reserve')) setLocked(true);
      setNotice(message);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const startReview = async () => {
    const res = await apiClient.get<{ questions: ReviewQuestion[] }>('/progression/review');
    setReview(res.data.questions);
    setPicks({});
  };

  const submitReview = async () => {
    if (!review) return;
    const res = await apiClient.post<{ resolved: number; points_awarded: number }>('/progression/review', {
      answers: review.map((question) => ({ questionId: question.question_id, selected: picks[question.question_id] })),
    });
    setNotice(`${res.data.resolved} erreur(s) corrigée(s). Points ajoutés : ${res.data.points_awarded}.`);
    setReview(null);
    await load();
  };

  const equip = async (kind: StyleItem['kind'], code: string) => {
    const key = kind === 'frame' ? 'frame_code' : kind === 'theme' ? 'theme_code' : 'avatar_code';
    try {
      await apiClient.patch('/progression/style', { [key]: code });
      await load();
    } catch (error) {
      setNotice(apiError(error));
    }
  };

  return (
    <div className="home-page carnet-page">
      <button type="button" className="premium-status-cta" onClick={() => navigate(Routes.HOME)}>
        Retour à l’accueil
      </button>
      <section className="premium-status-block">
        <h2>Carnet d’erreurs</h2>
        <p>La révision n’ajoute aucun point au classement.</p>
        {locked ? (
          <button type="button" className="premium-status-cta" onClick={() => navigate(Routes.PREMIUM)}>
            Voir le Premium
          </button>
        ) : null}
        {notice ? <p>{notice}</p> : null}
        {notebook ? <p>{notebook.open_count} question(s) encore ouvertes.</p> : null}
        {notebook?.categories.map((category) => (
          <div key={category.category_name}>
            <h3>{category.category_name} · {category.open_count}</h3>
            <ul>
              {category.mistakes.map((mistake) => (
                <li key={mistake.question_id}>
                  {mistake.question_text}
                  <br />
                  Ta réponse : {mistake.your_answer ?? '—'} · Bonne réponse : {mistake.correct_answer ?? '—'}
                  {mistake.explanation ? <><br />{mistake.explanation}</> : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {!review && notebook && notebook.open_count > 0 ? (
          <button type="button" className="premium-status-cta" onClick={() => void startReview()}>
            Refaire les questions ratées
          </button>
        ) : null}
        {review ? (
          <div>
            {review.map((question) => (
              <fieldset key={question.question_id}>
                <legend>{question.question_text}</legend>
                {(Array.isArray(question.options) ? question.options : []).map((option) => (
                  <label key={option.id}>
                    <input
                      type="radio"
                      name={question.question_id}
                      checked={picks[question.question_id] === option.id}
                      onChange={() => setPicks((current) => ({ ...current, [question.question_id]: option.id }))}
                    />
                    {option.label}
                  </label>
                ))}
              </fieldset>
            ))}
            <button type="button" className="premium-status-cta" onClick={() => void submitReview()}>
              Corriger sans marquer de points
            </button>
          </div>
        ) : null}
      </section>

      <section className="premium-status-block">
        <h2>Badges d’Afrique de l’Ouest</h2>
        <p>Médaillons de terre cuite, indigo waxi et or du Sahel. Un badge non obtenu reste le même objet, mat.</p>
        <BadgeGrid badges={badges} />
      </section>

      <section className="premium-status-block">
        <h2>Style</h2>
        {(['frame', 'theme', 'avatar'] as const).map((kind) => (
          <p key={kind}>
            {kind === 'frame' ? 'Cadre' : kind === 'theme' ? 'Thème' : 'Avatar'}
            {styles.filter((item) => item.kind === kind).map((item) => (
              <button key={item.code} type="button" className="premium-status-cta" disabled={item.locked} onClick={() => void equip(kind, item.code)}>
                {item.name}{item.locked ? ' · Premium' : ''}
              </button>
            ))}
          </p>
        ))}
      </section>

      {goal ? (
        <section className="premium-status-block">
          <h2>Objectif de la semaine</h2>
          <p>{goal.label} · {goal.progress}/{goal.target}</p>
          <button
            type="button"
            className="premium-status-cta"
            onClick={() => void apiClient.patch('/progression/reminder', { enabled: !goal.reminder_enabled }).then(load)}
          >
            {goal.reminder_enabled ? 'Rappel activé' : 'Activer le rappel'}
          </button>
          <button type="button" className="premium-status-cta" onClick={() => void apiClient.post('/progression/streak-freeze').then(load).catch((error) => setNotice(apiError(error)))}>
            Geler la série
          </button>
        </section>
      ) : null}

      {stats.length > 0 ? (
        <section className="premium-status-block">
          <h2>30 derniers jours</h2>
          <ul>
            {stats.map((row) => (
              <li key={row.category_name}>
                {row.category_name} · {row.plays} parties classées · {row.open_mistakes} erreurs ouvertes
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
