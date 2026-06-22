export type Lang = 'DE' | 'EN';

export interface ContactItem {
  label: string;
  href: string;
}

export interface FooterContent {
  about: string;
  services: { title: string; items: string[] };
  learn: { title: string; items: string[] };
  contact: { title: string; items: ContactItem[] };
  legal: string[];
}

const contactItems: ContactItem[] = [
  { label: 'info@bumbleflies.de', href: 'mailto:info@bumbleflies.de' },
  { label: 'LinkedIn', href: 'https://de.linkedin.com/company/bumbleflies' },
  { label: 'Mastodon', href: 'https://social.bumbleflies.de' },
  { label: 'GitHub', href: 'https://github.com/bumbleflies' },
];

export function getFooterContent(lang: Lang): FooterContent {
  return lang === 'DE'
    ? {
        about:
          'Eine kleine Werkstatt aus Facilitator:innen, KI-Consultants und Entwickler:innen. Remote-first, vor Ort wenn\'s zählt.',
        services: { title: 'Leistungen', items: ['Facilitation (remote, hybrid, vor Ort)', 'AI Consulting', 'App Development', 'Coaching & Handover'] },
        learn: { title: 'Lernen', items: ['FaST-Training', 'GPT-Training', 'AI-Literacy', 'Open Space Checkliste'] },
        contact: { title: 'Kontakt', items: contactItems },
        legal: ['Impressum', 'Datenschutz'],
      }
    : {
        about:
          'A small workshop of facilitators, AI consultants and developers. Remote-first, on-site when it matters.',
        services: { title: 'Services', items: ['Facilitation (remote, hybrid, on-site)', 'AI Consulting', 'App Development', 'Coaching & Handover'] },
        learn: { title: 'Learn', items: ['FaST Training', 'GPT Training', 'AI Literacy', 'Open Space Checklist'] },
        contact: { title: 'Contact', items: contactItems },
        legal: ['Imprint', 'Privacy'],
      };
}
