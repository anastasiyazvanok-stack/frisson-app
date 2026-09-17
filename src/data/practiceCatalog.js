import { getSections } from './content.js';
import { AUDIO_URLS } from './audioUrls.js';

export const normalizeSearch = text => String(text || '').normalize('NFKC').toLowerCase().replace(/ё/g, 'е').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const keywords = {
  1: 'любовь пустота привязанность одиночество love loneliness',
  2: 'усталость энергия выгорание fatigue burnout energy',
  3: 'сон тревога стресс расслабление sleep anxiety stress relaxation',
  4: 'уверенность контроль опора confidence control',
  5: 'женственность энергия femininity energy',
  7: 'притягательность отношения attraction relationships',
  10: 'деньги изобилие принятие money abundance receiving',
  11: 'тревога безопасность доверие anxiety safety trust',
  13: 'благодарность перемены gratitude change',
  14: 'рост деньги перемены growth money change',
  15: 'будущее цель направление future purpose',
  16: 'вера надежда перемены faith hope change',
  17: 'самоценность уверенность подлинность self worth confidence authenticity',
  24: 'усталость женственность ресурс fatigue femininity',
  25: 'границы тревога свой путь boundaries anxiety',
};
export function getPracticeCatalog(lang = 'ru') {
  const originals = getSections('ru').flatMap(s => s.meds);
  const english = getSections('en').flatMap(s => s.meds);
  return getSections(lang).flatMap(s => s.meds.map(m => {
    const ru = originals.find(x => x.n === m.n);
    const en = english.find(x => x.n === m.n);
    return { ...m, id: `med-${m.n}`, canonicalTitle: ru.title, sectionId: s.id, color: s.color,
      audio_url: AUDIO_URLS[ru.title] || m.audio_url,
      aliases: [ru.title, en.title],
      searchText: normalizeSearch([m.title, ru.title, en.title, m.short, m.long, s.title, keywords[m.n]].join(' ')) };
  }));
}
export function findPractice(value, lang = 'ru') {
  return getPracticeCatalog(lang).find(m => m.id === value || m.aliases.includes(value));
}
export function searchPractices(catalog, query) {
  const terms = normalizeSearch(query).split(' ').filter(Boolean);
  return catalog.filter(m => terms.every(term => m.searchText.includes(term)));
}
// Longest names win so “New level” does not duplicate “Gratitude and a new level”.
export function recommendedPractices(text, lang = 'ru') {
  let remaining = ` ${normalizeSearch(text)} `;
  const found = [];
  const candidates = getPracticeCatalog(lang).filter(m => m.audio_url)
    .flatMap(m => m.aliases.map(name => ({ m, name: normalizeSearch(name) })))
    .sort((a,b) => b.name.length - a.name.length);
  for (const {m, name} of candidates) {
    const needle = ` ${name} `;
    if (remaining.includes(needle)) {
      if (!found.some(x => x.id === m.id)) found.push(m);
      remaining = remaining.split(needle).join(' ');
    }
  }
  return found;
}
