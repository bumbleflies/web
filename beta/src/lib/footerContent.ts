export type Lang = 'DE' | 'EN';

export interface ContactItem {
  label: string;
  href: string;
}

export interface FooterContent {
  about: string;
  services: { title: string; items: LinkItem[] };
  learn: { title: string; items: LinkItem[] };
  contact: { title: string; items: ContactItem[] };
  legal: string[];
}

interface LinkItem {
  label: string;
  href: string;
}

const contactItems: ContactItem[] = [
  { label: 'info@bumbleflies.de', href: 'mailto:info@bumbleflies.de' },
  { label: 'LinkedIn', href: 'https://de.linkedin.com/company/bumbleflies' },
  { label: 'Mastodon', href: 'https://social.bumbleflies.de' },
  { label: 'GitHub', href: 'https://github.com/bumbleflies' },
];

export function getFooterContent(lang: Lang): FooterContent {
  const aiConsultingHref = lang === 'DE' ? '/ai-consulting' : '/en/ai-consulting';
const servicesHref = lang === 'DE' ? '/services' : '/en/services';
  return lang === 'DE'
    ? {
        about:
          'Eine kleine Werkstatt aus Facilitator:innen, KI-Consultants und Entwickler:innen. Remote-first, vor Ort wenn\'s zählt.',
        services: {
          title: 'Leistungen',
          items: [
            { label: 'Facilitation (remote, hybrid, vor Ort)', href: servicesHref },
            { label: 'AI Consulting', href: aiConsultingHref },
            { label: 'App Development', href: servicesHref },
            { label: 'Coaching & Handover', href: servicesHref },
          ],
        },
        learn: {
          title: 'Lernen',
          items: [
            { label: 'FaST-Training', href: servicesHref },
            { label: 'Field Notes (KI-Serie)', href: '/blog' },
            { label: 'AI-Literacy', href: servicesHref },
            { label: 'Open Space Prinzipien', href: '/open-space' },
            { label: 'Open Space Checkliste', href: servicesHref },
            { label: 'Kurse für Kinder', href: 'https://edu.bumbleflies.de/' },
          ],
        },
        contact: { title: 'Kontakt', items: contactItems },
        legal: ['Impressum', 'Datenschutz'],
      }
    : {
        about:
          'A small workshop of facilitators, AI consultants and developers. Remote-first, on-site when it matters.',
        services: {
          title: 'Services',
          items: [
            { label: 'Facilitation (remote, hybrid, on-site)', href: servicesHref },
            { label: 'AI Consulting', href: aiConsultingHref },
            { label: 'App Development', href: servicesHref },
            { label: 'Coaching & Handover', href: servicesHref },
          ],
        },
        learn: {
          title: 'Learn',
          items: [
            { label: 'FaST Training', href: servicesHref },
            { label: 'Field Notes (AI series)', href: '/en/blog' },
            { label: 'AI Literacy', href: servicesHref },
            { label: 'Open Space Principles', href: '/en/open-space' },
            { label: 'Open Space Checklist', href: servicesHref },
            { label: 'Coding for Kids', href: 'https://edu.bumbleflies.de/' },
          ],
        },
        contact: { title: 'Contact', items: contactItems },
        legal: ['Imprint', 'Privacy'],
      };
}
