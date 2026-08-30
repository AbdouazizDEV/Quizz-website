const CARDS = [
  { id: 'c1', cat: 'Culture', q: 'Qui a peint La Joconde ?', tilt: -14, z: 3 },
  { id: 'c2', cat: 'Sport', q: 'Combien de joueurs sur un terrain de foot ?', tilt: 6, z: 2 },
  { id: 'c3', cat: 'Tech', q: 'Que signifie “HTTP” ?', tilt: 18, z: 1 },
] as const;

export function LandingDeck() {
  return (
    <div className="lp-deck" aria-hidden>
      <div className="lp-deck-orbit">
        {CARDS.map((card, index) => (
          <article
            key={card.id}
            className={`lp-deck-card lp-deck-card--${index + 1}`}
            style={{
              ['--tilt' as string]: `${card.tilt}deg`,
              zIndex: card.z,
            }}
          >
            <span className="lp-deck-cat">{card.cat}</span>
            <p className="lp-deck-q">{card.q}</p>
            <div className="lp-deck-opts">
              <span />
              <span />
              <span />
              <span />
            </div>
          </article>
        ))}
      </div>
      <div className="lp-deck-ring" />
      <div className="lp-deck-spark lp-deck-spark--a" />
      <div className="lp-deck-spark lp-deck-spark--b" />
    </div>
  );
}
