export function summarizeData(data = {}) {
  const parse = key => { try { return JSON.parse(data[key] || 'null'); } catch { return null; } };
  const diary = parse('frisson_journal'), events = parse('frisson_psycap_v2')?.events;
  const completed = parse('nectar_practices')?.completed, chat = parse('lux_coach_history');
  return {
    diary: ['intent','grat','goals','reflect'].reduce((n,k) => n + (Array.isArray(diary?.[k]) ? diary[k].length : 0), 0),
    events: Array.isArray(events) ? events.length : 0,
    completed: completed && typeof completed === 'object' ? Object.keys(completed).length : 0,
    messages: Array.isArray(chat) ? chat.length : 0,
  };
}

