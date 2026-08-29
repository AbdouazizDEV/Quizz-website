interface DefisTabSwitcherProps<T extends string> {
  tabs: Array<{ id: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}

export function DefisTabSwitcher<T extends string>({ tabs, value, onChange }: DefisTabSwitcherProps<T>) {
  return (
    <div className="defis-tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          className={tab.id === value ? 'defis-tab is-active' : 'defis-tab'}
          aria-selected={tab.id === value}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
