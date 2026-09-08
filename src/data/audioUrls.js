const BASE = "/audio";

export const AUDIO_URLS = {
  "Возвращение к наполненности":        `${BASE}/vozvrashchenie-k-napolnennosti.mp3`,
  "Восполниться энергией":              `${BASE}/vospolnitsya-energiey.mp3`,
  "Женское внутреннее расслабление":    `${BASE}/zhenskoe-vnutrennee-rasslablenie.mp3`,
  "Я управляю своей жизнью":                `${BASE}/ya-avtor-svoey-zhizni.mp3`,
  "Женская энергия":                    `${BASE}/zhenskaya-energiya.mp3`,
  "Состояние женской притягательности": `${BASE}/sostoyanie-zhenskoy-prityagatelnosti.mp3`,
  "Доверие к миру":                     `${BASE}/doverie-k-miru.mp3`,
  "Благодарность и новый уровень":      `${BASE}/blagodarnost-i-novyy-uroven.mp3`,
  "Новый уровень":                      `${BASE}/novyy-uroven.mp3`,
  "Вера — мост между реальностями":     `${BASE}/vera-most-mezhdu-realnostyami.mp3`,
  "Право быть настоящей":               `${BASE}/pravo-byt-nastoyashchey.mp3`,
  "Мой ритм, мой формат, моя жизнь":    `${BASE}/moy-ritm-moy-format-moya-zhizn.mp3`,
  "Восполнение женской ресурсности":    `${BASE}/vospolnenie-zhenskoy-resursnosti.mp3`,
  "Получение благ от мира":             `${BASE}/poluchenie-blag-ot-mira.mp3`,
  "Разговор с собой из будущего":       `${BASE}/razgovor-s-soboy-iz-budushchego.mp3`,
};

// Display names may be translated; canonicalTitle stays stable across languages.
// Only advertise local recordings actually included in this build, or a configured CDN.
export function getAudioUrl(med, config = import.meta.env || {}) {
  if (!med) return null;
  if (med.audio_url && /^(https?:\/\/|\/[^/])/.test(med.audio_url)) return med.audio_url;
  const path = AUDIO_URLS[med.canonicalTitle || med.title];
  if (!path) return null;
  const base = config.VITE_AUDIO_BASE_URL;
  if (base && /^https:\/\//.test(base)) return `${base.replace(/\/$/, '')}/${path.split('/').pop()}`;
  const files = config.LOCAL_AUDIO_FILES || [];
  if (!files.includes(path.split('/').pop())) return null;
  return `${config.BASE_URL || '/'}audio/${path.split('/').pop()}`;
}
