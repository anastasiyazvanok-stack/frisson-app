export default function AccessPanel({ membership, lang = 'ru', compact = false }) {
  const ru = lang === 'ru';
  const { access, active, error, refresh } = membership;
  const date = access?.expires_at && new Date(access.expires_at).toLocaleString(ru ? 'ru-RU' : 'en-GB');
  const message = error ? (ru ? 'Не удалось проверить доступ. Ваши записи доступны в дневнике.' : 'Could not check access. Your journal remains available.')
    : !access ? (ru ? 'Проверяем доступ…' : 'Checking access…')
    : active ? (access.status === 'admin' ? (ru ? 'Доступ администратора' : 'Administrator access') : `${access.status === 'trial' ? (ru ? 'Тестовый доступ до ' : 'Trial access until ') : (ru ? 'Подписка до ' : 'Subscription until ')}${date}`)
    : (ru ? 'Практики доступны участницам с действующим доступом.' : 'An active membership is required for practices.');
  return <section style={{ padding: compact ? '12px 20px' : 28, color: '#f3e8ef', background: '#241428' }}>
    <p role="status">{message}</p>
    {!active && access && <p>{ru ? 'Аккаунт, дневник и прогресс сохраняются. Если вы в тестовой группе, сообщите Анастасии email вашего аккаунта. Оплата появится позже — новый аккаунт создавать не потребуется.' : 'Your account, journal and progress are retained. If you are a tester, share your account email with Anastasiya. Payments are coming later; keep this account.'}</p>}
    {(error || (!active && access)) && <button onClick={refresh}>{ru ? 'Проверить доступ' : 'Check access'}</button>}
  </section>;
}
