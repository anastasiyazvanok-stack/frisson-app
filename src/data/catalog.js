import { getSections } from './content.js';
export function buildCatalog(lang, remoteMeds, remoteSections) {
  const originals = getSections('ru').flatMap(s => s.meds);
  const translated = getSections(lang).flatMap(s => s.meds);
  if (!Array.isArray(remoteMeds)) return getSections(lang).map(section => ({ ...section,
    meds: section.meds.map(m => ({ ...m, id: `builtin-${m.n}`, canonicalTitle: originals.find(o => o.n === m.n)?.title || m.title })) }));
  const sections = (remoteSections || []).filter(s => s.active !== false).map(s => ({
    id: s.id, title: s.name, color: s.color || '#C8A8F0', meds: [],
  }));
  for (const remote of remoteMeds.filter(m => m.active !== false)) {
    if (Array.isArray(remoteSections) && remote.section_id && !sections.some(s => s.id === remote.section_id)) continue;
    const original = originals.find(m => m.title === remote.title || String(m.n) === String(remote.n));
    const translation = original && translated.find(m => m.n === original.n);
    let section = sections.find(s => s.id === remote.section_id);
    if (!section) {
      const id = remote.section_id || 'other';
      section = sections.find(s => s.id === id);
      if (!section) { section = { id, title: remote.sections?.name || (lang === 'ru' ? 'Медитации' : 'Meditations'), color: remote.sections?.color || '#C8A8F0', meds: [] }; sections.push(section); }
    }
    section.meds.push({ ...original, ...remote, id: remote.id, n: remote.n || original?.n || '✦',
      title: lang === 'en' && translation && remote.title === original?.title ? translation.title : remote.title,
      canonicalTitle: original?.title || remote.title,
      short: remote.short || '', long: remote.long || remote.short || '',
      dur: remote.duration || remote.dur || translation?.dur || (lang === 'ru' ? 'Аудиопрактика' : 'Audio practice'),
    });
  }
  return sections.filter(s => s.meds.length);
}
