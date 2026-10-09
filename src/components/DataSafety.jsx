import { useState } from 'react';
import { supabase, syncToCloud } from '../lib/supabase';
import { getActiveUser, readUser, readRecovery, preserveLocal } from '../lib/userStorage';
import { summarizeData } from '../lib/dataSummary';

export default function DataSafety({ userId, userEmail, lang }) {
  const ru = lang === 'ru';
  const [report, setReport] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const button = { padding: '10px 14px', color: '#eee', background: '#37213c', border: '1px solid #806489', borderRadius: 10, cursor: 'pointer' };
  async function inspect() {
    setBusy(true); setError(''); setReport(null);
    try {
      if (getActiveUser() !== userId) throw new Error('account');
      preserveLocal(userId);
      const local = readUser(userId);
      const { data: cloud, error: cloudError } = await supabase.from('user_data').select('data, updated_at').eq('id', userId).maybeSingle();
      if (cloudError) throw cloudError;
      const history = await supabase.from('user_data_history').select('data, captured_at').eq('user_id', userId).order('captured_at', { ascending: false }).limit(30);
      if (getActiveUser() !== userId) return;
      setReport({ userId, email: userEmail, checkedAt: new Date().toISOString(), local,
        cloud, localCopies: readRecovery(userId), cloudCopies: history.data || [], historyUnavailable: !!history.error });
    } catch {
      setError(ru ? 'Не удалось проверить сохранение. Данные на устройстве не заменены. Попробуйте при стабильном интернете.' : 'Could not check storage. Local data was not replaced. Retry with a stable connection.');
    } finally { setBusy(false); }
  }
  async function retry() {
    setBusy(true); setError('');
    try {
      if (getActiveUser() !== userId) throw new Error('account');
      await syncToCloud(userId); await inspect();
    } catch {
      setError(ru ? 'Синхронизация не завершена. При различии версий мы не заменяем данные автоматически. Скачайте копию и обратитесь к Анастасии.' : 'Sync did not complete. Conflicting versions are not overwritten. Download a copy and contact Anastasia.');
    } finally { setBusy(false); }
  }
  function download() {
    if (!report || getActiveUser() !== userId) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'nectar-my-data.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
  const describe = data => {
    const s = summarizeData(data);
    return ru ? `Дневник: ${s.diary} · События: ${s.events} · Отмеченные практики: ${s.completed} · Сообщения: ${s.messages}` : `Journal: ${s.diary} · Events: ${s.events} · Marked practices: ${s.completed} · Messages: ${s.messages}`;
  };
  return <details style={{ margin: '20px 24px', padding: 16, border: '1px solid #806489', borderRadius: 14, color: '#eee', fontSize: 14 }}>
    <summary style={{ cursor: 'pointer' }}>{ru ? 'Сохранение данных' : 'Data storage'}</summary>
    <p>{userEmail}</p>
    <p>{ru ? 'Проверка сравнит данные на этом устройстве и в облаке. Она ничего не удаляет и не восстанавливает автоматически.' : 'Compare this device with cloud storage. Checking does not delete or automatically restore anything.'}</p>
    <button type="button" style={button} disabled={busy} onClick={inspect}>{busy ? '…' : ru ? 'Проверить сохранение' : 'Check storage'}</button>
    {error && <p role="alert">{error}</p>}
    {report && <div>
      <p><b>{ru ? 'На устройстве' : 'On this device'}</b><br />{describe(report.local.data)}</p>
      <p><b>{ru ? 'В облаке' : 'In the cloud'}</b><br />{report.cloud ? describe(report.cloud.data) : ru ? 'Сохранений пока нет' : 'No saved data yet'}</p>
      <p>{ru ? 'Последняя запись в облако: ' : 'Last cloud save: '}{report.cloud?.updated_at ? new Date(report.cloud.updated_at).toLocaleString(ru ? 'ru-RU' : 'en-GB') : '—'}</p>
      <p>{report.local.dirty ? (ru ? 'Есть изменения, ожидающие синхронизации.' : 'Some changes are waiting to sync.') : (ru ? 'На момент проверки нет изменений, ожидающих отправки.' : 'No changes waiting to upload at check time.')}</p>
      <p>{ru ? 'Сохранённых копий на устройстве: ' : 'Saved device copies: '}{(report.localCopies.initial ? 1 : 0) + report.localCopies.recent.length}. {ru ? 'В облаке: ' : 'In cloud: '}{report.historyUnavailable ? '—' : report.cloudCopies.length}</p>
      {[report.localCopies.initial, ...report.localCopies.recent].filter(Boolean).map((copy, i) => <p key={i}>{ru ? 'Копия устройства: ' : 'Device copy: '}{new Date(copy.capturedAt).toLocaleString(ru ? 'ru-RU' : 'en-GB')}<br />{describe(copy.data)}</p>)}
      <p>{ru ? 'Файл содержит ваши личные записи и чат. Сохраните его у себя; отправлять кому-либо необязательно.' : 'The file contains your private journal and chat. Keep it private; sharing is optional.'}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <button type="button" style={button} disabled={busy} onClick={download}>{ru ? 'Скачать мою копию' : 'Download my copy'}</button>
        <button type="button" style={button} disabled={busy} onClick={retry}>{ru ? 'Повторить синхронизацию' : 'Retry sync'}</button>
      </div>
    </div>}
  </details>;
}

