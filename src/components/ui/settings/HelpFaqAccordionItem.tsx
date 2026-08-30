import { useState } from 'react';

import { Icon } from '@components/ui/Icon';

interface HelpFaqAccordionItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export function HelpFaqAccordionItem({
  question,
  answer,
  defaultOpen = false,
}: HelpFaqAccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={open ? 'settings-faq is-open' : 'settings-faq'}>
      <button type="button" className="settings-faq-head" onClick={() => setOpen((value) => !value)}>
        <strong>{question}</strong>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} color="#9E9E9E" />
      </button>
      <div className="settings-faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  );
}
