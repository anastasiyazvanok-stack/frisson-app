import { useEffect, useRef, useState } from 'react';
import { getActiveUser } from '../lib/userStorage.js';
import { getPracticeState, updatePracticeState, mergeListenedRanges, isListened } from '../lib/practiceState.js';
import { logMeditation } from '../data/psycap.js';

export function usePracticePlayer(med, doMarkPractice, addGems) {
  const audioRef = useRef(null);
  const callbacks = useRef({ doMarkPractice, addGems });
  useEffect(() => { callbacks.current = { doMarkPractice, addGems }; }, [doMarkPractice, addGems]);
  const [play, setPlay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !med?.audio_url) return;
    const owner = getActiveUser();
    const saved = getPracticeState().progress[med.id];
    let position = saved?.position || 0;
    let ranges = position > 0 ? saved?.ranges || [] : [];
    let credited = position > 0 && !!saved?.credited;
    let previous = null, previousWall = 0, lastSaved = 0, ready = false, changed = false;
    setPlay(false); setCurrentTime(position); setDuration(0); setError(false);
    const persist = (force = false) => {
      if (!ready || !changed || (!force && Date.now()-lastSaved < 5000)) return;
      lastSaved = Date.now();
      updatePracticeState(s => {
        s.progress[med.id] = { position, duration: audio.duration, ranges, credited, at: Date.now() };
        return s;
      }, owner);
    };
    const loaded = () => {
      ready = true;
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
        position = Math.min(position, Math.max(0, audio.duration - 1));
        audio.currentTime = position;
      }
    };
    const time = () => {
      if (getActiveUser() !== owner) { audio.pause(); return; }
      const now = audio.currentTime;
      const elapsed = (Date.now() - previousWall) / 1000;
      if (!audio.paused && !audio.seeking && previous !== null && now > previous && now-previous <= elapsed * (audio.playbackRate || 1) + 1) {
        ranges = mergeListenedRanges(ranges, previous, now);
        changed = true;
      }
      previous = audio.paused || audio.seeking ? null : now;
      previousWall = Date.now();
      position = now;
      setCurrentTime(now);
      if (!credited && isListened(ranges, audio.duration)) {
        credited = true;
        updatePracticeState(s => { s.completed[med.id] = { at: Date.now() }; return s; }, owner);
        logMeditation(med.canonicalTitle, 'full');
        callbacks.current.doMarkPractice?.(Math.round(audio.duration / 60), 'meditation');
        callbacks.current.addGems?.(Math.max(1, Math.round(audio.duration / 60)));
      }
      persist();
    };
    const playing = () => { if (position === 0 && credited) { ranges = []; credited = false; } previousWall = Date.now(); previous = audio.currentTime; setPlay(true); setError(false); };
    const pause = () => { previous = null; setPlay(false); persist(true); };
    const seeking = () => { previous = null; };
    const seeked = () => { position = audio.currentTime; if (position === 0 && credited) { ranges = []; credited = false; } changed = true; persist(true); };
    const ended = () => { position = 0; changed = true; setPlay(false); persist(true); };
    const failed = () => { setError(true); setPlay(false); };
    const hide = () => { if (document.visibilityState === 'hidden') persist(true); };
    const events = { loadedmetadata: loaded, timeupdate: time, play: playing, pause, seeking, seeked, ended, error: failed };
    for (const [name, fn] of Object.entries(events)) audio.addEventListener(name, fn);
    document.addEventListener('visibilitychange', hide);
    audio.src = med.audio_url; audio.preload = 'metadata'; audio.load();
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({ title: med.title, artist: 'NECTAR' });
        navigator.mediaSession.setActionHandler('play', () => audio.play().catch(failed));
        navigator.mediaSession.setActionHandler('pause', () => audio.pause());
        navigator.mediaSession.setActionHandler('seekbackward', () => { audio.currentTime = Math.max(0, audio.currentTime-15); });
        navigator.mediaSession.setActionHandler('seekforward', () => { audio.currentTime = Math.min(audio.duration || 0, audio.currentTime+15); });
      } catch { /* optional browser API */ }
    }
    return () => {
      persist(true);
      for (const [name, fn] of Object.entries(events)) audio.removeEventListener(name, fn);
      document.removeEventListener('visibilitychange', hide);
      audio.pause(); audio.removeAttribute('src'); audio.load();
      if ('mediaSession' in navigator) {
        for (const action of ['play','pause','seekbackward','seekforward']) {
          try { navigator.mediaSession.setActionHandler(action, null); } catch { /* optional */ }
        }
      }
    };
  }, [med?.id, med?.audio_url]);
  function togglePlay() {
    const audio = audioRef.current;
    if (!med?.audio_url || !audio) return;
    if (audio.paused) audio.play().catch(() => setError(true)); else audio.pause();
  }
  function seekTo(pct) {
    const audio = audioRef.current;
    if (audio && Number.isFinite(audio.duration)) audio.currentTime = Math.max(0, Math.min(100, pct)) / 100 * audio.duration;
  }
  return { audioRef, play, currentTime, duration, prog: duration ? currentTime/duration*100 : 0, error, togglePlay, seekTo };
}
