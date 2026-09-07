import { useState } from 'react';
import { supabase } from '../lib/supabase.js';

export default function BetaAdmin() {
  const [email, setEmail] = useState('');
  const [until, setUntil] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function save(event) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const expires = new Date(until);
      if (!Number.isFinite(expires.getTime()) || expires <= new Date()) throw new Error('Выберите будущую дату');
      const { error } = await supabase.rpc('grant_beta_access', { participant_email: email.trim(), expires_at: expires.toISOString() });
      if (error) throw error;
      setMessage('Доступ сохранён. Участница должна войти с этим email и подтвердить адрес. Приглашение по почте не отправлялось.');
    } catch (error) { setMessage(`Не удалось сохранить: ${error.message}`); }
    finally { setBusy(false); }
  }
  return <form onSubmit={save} style={{ padding: 24, display: 'grid', gap: 12 }}>
    <h2>Тестовая группа</h2>
    <p>Назначьте доступ до конкретной даты. Повторное сохранение меняет срок; аккаунт и дневник не удаляются.</p>
    <label>Email участницы<input required type="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
    <label>Доступ до (ваше местное время)<input required type="datetime-local" value={until} onChange={e => setUntil(e.target.value)} /></label>
    <button disabled={busy}>{busy ? 'Сохраняем…' : 'Выдать / изменить доступ'}</button>
    {message && <p role="status">{message}</p>}
  </form>;
}
