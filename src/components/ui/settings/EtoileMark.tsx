interface EtoileMarkProps {
  size?: number;
}

export function EtoileMark({ size = 47 }: EtoileMarkProps) {
  return (
    <img
      src="/assets/icons/Etoile.svg"
      alt=""
      width={size}
      height={size}
      className="settings-etoile"
      draggable={false}
    />
  );
}
