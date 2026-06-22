import React, { useState, useEffect, useRef } from 'react';
import {
  Search, X, Star, MessageSquare, Film,
  Clapperboard, Popcorn, Check, ChevronLeft,
  Sparkles, AlertCircle, Loader2
} from 'lucide-react';

// --- HELPER : classes texte adaptées au thème ---
function useThemeStyles(isLight) {
  return {
    textPrimary:   { color: 'var(--text-primary)' },
    textSecondary: { color: 'var(--text-secondary)' },
    textMuted:     { color: 'var(--text-muted)' },
    textAccent:    { color: 'var(--accent-color)' },
    bgCard:        { backgroundColor: 'var(--card-color)' },
    bgMain:        { backgroundColor: 'var(--bg-color)' },
    borderSubtle:  { borderColor: 'var(--border-subtle)' },
    borderMedium:  { borderColor: 'var(--border-medium)' },
  };
}

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const TMDB_API_KEY = 'TON_API_KEY_ICI'; // à remplacer
const TMDB_BASE    = 'https://api.themoviedb.org/3';
const TMDB_IMG     = 'https://image.tmdb.org/t/p/w500';
const TMDB_IMG_SM  = 'https://image.tmdb.org/t/p/w200';

const SECTIONS = [
  { key: 'elite', label: 'Élite',  cls: 'bg-purple-600 text-white border-purple-400/40',        desc: 'Un chef-d\'œuvre. À revoir absolument.' },
  { key: 'moyen', label: 'Moyen',  cls: 'bg-amber-500 text-slate-950 border-amber-300/40',       desc: 'Correct. Pas de regrets, pas d\'ovation.' },
  { key: 'navet', label: 'Navet',  cls: 'bg-rose-600 text-white border-rose-400/40',             desc: 'Tu t\'es sacrifié. Noté pour ne plus recommencer.' },
];

// ─── COMPOSANT : Étoiles interactives ────────────────────────────────────────
function StarPicker({ value, onChange, ts }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => {
        const isActive = i <= (hovered || value);
        return (
          <button
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(i)}
            className="transition-transform duration-150 hover:scale-125"
          >
            <Star
              size={28}
              className="transition-colors duration-150"
              style={{
                color: isActive ? 'var(--accent-color)' : 'var(--border-medium)',
                fill: isActive ? 'var(--accent-color)' : 'transparent',
                filter: isActive ? 'drop-shadow(0 0 8px var(--accent-color))' : 'none'
              }}
            />
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-[11px] font-black uppercase tracking-widest" style={ts.textMuted}>
          {['', 'Catastrophe', 'Décevant', 'Correct', 'Bien', 'Chef-d\'œuvre'][value]}
        </span>
      )}
    </div>
  );
}

// ─── COMPOSANT PRINCIPAL ─────────────────────────────────────────────────────
export default function SearchAdd({ onBack, onFilmAdded, currentTheme }) {
  const isLight = currentTheme?.isLight || false;
  const ts = useThemeStyles(isLight);

  // Étapes : 'search' → 'form'
  const [step,         setStep]         = useState('search');
  const [query,        setQuery]        = useState('');
  const [results,      setResults]      = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);

  // Formulaire d'ajout
  const [rating,   setRating]   = useState(0);
  const [section,  setSection]  = useState('');
  const [comment,  setComment]  = useState('');
  const [isFav,    setIsFav]    = useState(false);
  const [isHeart,  setIsHeart]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);

  const inputRef  = useRef(null);
  const timerRef  = useRef(null);

  // Focus auto sur l'input
  useEffect(() => {
    if (step === 'search') inputRef.current?.focus();
  }, [step]);

  // Debounce recherche TMDB
  useEffect(() => {
    clearTimeout(timerRef.current);
    if (query.trim().length < 2) { setResults([]); return; }
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const res  = await fetch(
          `${TMDB_BASE}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=fr-FR&page=1`
        );
        const data = await res.json();
        setResults((data.results || []).slice(0, 6));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  const handleSelectFilm = (film) => {
    setSelectedFilm(film);
    setStep('form');
    setRating(0); setSection(''); setComment('');
    setIsFav(false); setIsHeart(false); setSaved(false);
  };

  const handleSave = async () => {
    if (!rating || !section) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 800)); // simuler l'appel API
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      onFilmAdded?.({
        title:     selectedFilm.title,
        year:      selectedFilm.release_date?.slice(0, 4) || '?',
        genres:    [],
        rating,
        section,
        isFavorite: isFav,
        isHeart,
        synopsis:  selectedFilm.overview || '',
        comment,
        posterUrl: selectedFilm.poster_path ? `${TMDB_IMG}${selectedFilm.poster_path}` : '',
        actors:    [],
      });
    }, 600);
  };

  const canSave = rating > 0 && section !== '';

  // ── STEP : SEARCH ──────────────────────────────────────────────────────────
  if (step === 'search') return (
    <div
      className="flex-1 w-full relative min-h-screen transition-colors duration-700"
      style={ts.bgMain}
    >
      {/* Filigrane */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Popcorn className="absolute top-[8%] right-[4%] rotate-12"
          style={{ color: 'var(--accent-color)', width: 200, height: 200, opacity: isLight ? 0.06 : 0.04 }} strokeWidth={1} />
        <Film className="absolute bottom-[15%] left-[2%] -rotate-6"
          style={{ color: isLight ? 'var(--text-muted)' : 'white', width: 220, height: 220, opacity: isLight ? 0.04 : 0.03 }} strokeWidth={1} />
      </div>

      <div className="relative z-10 max-w-[800px] mx-auto px-6 py-10">

        {/* En-tête */}
        <div className="mb-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest mb-6 transition-colors duration-200 group w-fit"
            style={ts.textMuted}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <ChevronLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-1" />
            Retour au dashboard
          </button>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.9] mb-3" style={ts.textPrimary}>
            Quel film<br />
            <span style={{ color: 'var(--accent-color)' }}>ce soir ?</span>
          </h1>
          <p className="text-sm font-medium" style={ts.textSecondary}>
            Tape un titre, on s'occupe du reste.
          </p>
        </div>

        {/* Barre de recherche */}
        <div
          className="flex items-center gap-4 rounded-2xl border px-6 py-4 mb-8 transition-all duration-300 focus-within:shadow-2xl"
          style={{
            backgroundColor: 'var(--card-color)',
            borderColor: 'color-mix(in srgb, var(--accent-color) 30%, transparent)',
            boxShadow: `0 0 0 1px color-mix(in srgb, var(--accent-color) 20%, transparent)`,
          }}
        >
          {loading
            ? <Loader2 size={22} className="shrink-0 animate-spin" style={{ color: 'var(--accent-color)' }} />
            : <Search size={22} className="shrink-0" style={{ color: 'var(--accent-color)' }} />
          }
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Interstellar, Matrix, Le Dîner de Cons…"
            className="flex-1 bg-transparent text-lg font-bold outline-none caret-[var(--accent-color)] placeholder-[color:var(--text-muted)]"
            style={ts.textPrimary}
          />
          {query && (
            <button onClick={() => { setQuery(''); setResults([]); }}
              className="transition-colors duration-200" style={ts.textMuted}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* Résultats */}
        {results.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1" style={ts.textMuted}>
              {results.length} résultat{results.length > 1 ? 's' : ''} TMDB
            </p>
            {results.map(film => (
              <button
                key={film.id}
                onClick={() => handleSelectFilm(film)}
                className="flex items-center gap-5 rounded-xl border p-4 transition-all duration-300 group text-left hover:-translate-y-0.5 hover:shadow-xl"
                style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent-color) 40%, transparent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                {/* Miniature poster */}
                <div className="w-14 h-20 rounded-lg overflow-hidden shrink-0 border transition-colors duration-300 group-hover:border-[var(--accent-color)]"
                  style={{ borderColor: 'var(--border-subtle)' }}>
                  {film.poster_path
                    ? <img src={`${TMDB_IMG_SM}${film.poster_path}`} alt={film.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    : <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--border-subtle)' }}>
                        <Film size={20} style={ts.textMuted} />
                      </div>
                  }
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-base uppercase tracking-tight truncate leading-none mb-1" style={ts.textPrimary}>
                    {film.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: 'var(--accent-color)' }}>
                      {film.release_date?.slice(0, 4) || '—'}
                    </span>
                    {film.vote_average > 0 && (
                      <>
                        <span style={ts.textMuted}>·</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={ts.textSecondary}>
                          TMDB {film.vote_average.toFixed(1)}/10
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed line-clamp-2" style={ts.textSecondary}>
                    {film.overview || 'Aucune description disponible.'}
                  </p>
                </div>

                {/* CTA */}
                <div
                  className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-110"
                  style={{
                    borderColor: 'var(--border-subtle)',
                    backgroundColor: 'color-mix(in srgb, var(--accent-color) 0%, transparent)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                >
                  <Sparkles size={16} className="transition-colors duration-300 group-hover:text-[var(--accent-color)]" style={{ color: 'var(--border-medium)' }} />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* État vide */}
        {!loading && query.trim().length >= 2 && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle size={40} className="mb-4" style={{ color: 'var(--border-medium)' }} strokeWidth={1} />
            <p className="font-black text-base uppercase tracking-wider" style={ts.textPrimary}>
              Aucun résultat pour "{query}"
            </p>
            <p className="text-xs mt-2" style={ts.textSecondary}>Vérifie l'orthographe ou essaie en anglais.</p>
          </div>
        )}

      </div>
    </div>
  );

  // ── STEP : FORM ────────────────────────────────────────────────────────────
  return (
    <div
      className="flex-1 w-full relative min-h-screen transition-colors duration-700"
      style={ts.bgMain}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Clapperboard className="absolute -bottom-10 -right-10"
          style={{ color: isLight ? 'var(--text-muted)' : 'white', width: 400, height: 400, opacity: isLight ? 0.04 : 0.03 }} strokeWidth={1} />
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto px-6 py-10">

        {/* Retour */}
        <button
          onClick={() => setStep('search')}
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest mb-8 transition-colors duration-200 group w-fit"
          style={ts.textMuted}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ChevronLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-1" />
          Changer de film
        </button>

        {/* Layout : poster + formulaire */}
        <div className="flex gap-8 items-start">

          {/* ── Poster ── */}
          <div className="shrink-0 w-[200px]">
            <div className="w-full aspect-[2/3] rounded-xl overflow-hidden border shadow-2xl mb-4" style={ts.borderSubtle}>
              {selectedFilm.poster_path
                ? <img src={`${TMDB_IMG}${selectedFilm.poster_path}`} alt={selectedFilm.title}
                    className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--border-subtle)' }}>
                    <Film size={40} style={ts.textMuted} />
                  </div>
              }
            </div>
            <p className="font-black text-sm uppercase tracking-tight leading-none mb-1" style={ts.textPrimary}>
              {selectedFilm.title}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: 'var(--accent-color)' }}>
              {selectedFilm.release_date?.slice(0, 4) || '—'}
            </p>
          </div>

          {/* ── Formulaire ── */}
          <div className="flex-1 min-w-0">

            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-px" style={{ backgroundColor: 'var(--accent-color)' }} />
              <span className="text-[9px] font-black uppercase tracking-[0.25em]"
                style={{ color: 'var(--accent-color)' }}>
                Ta critique
              </span>
            </div>

            {/* Titre punch */}
            <h2 className="text-3xl font-black tracking-tighter uppercase leading-[0.9] mb-6" style={ts.textPrimary}>
              C'était ta séance.<br />
              <span style={{ color: 'var(--accent-color)' }}>Verdict ?</span>
            </h2>

            {/* ─ Note ─ */}
            <div className="mb-6">
              <label className="block text-[9px] font-black uppercase tracking-[0.2em] mb-3" style={ts.textMuted}>
                Note / 5
              </label>
              <StarPicker value={rating} onChange={setRating} ts={ts} />
            </div>

            {/* ─ Catégorie ─ */}
            <div className="mb-6">
              <label className="block text-[9px] font-black uppercase tracking-[0.2em] mb-3" style={ts.textMuted}>
                Catégorie
              </label>
              <div className="flex gap-3 flex-wrap">
                {SECTIONS.map(s => (
                  <button
                    key={s.key}
                    onClick={() => setSection(s.key)}
                    className={`flex flex-col items-start px-4 py-3 rounded-xl border transition-all duration-200 text-left
                      ${section === s.key ? s.cls + ' shadow-lg scale-[1.03]' : ''}`}
                    style={section === s.key
                      ? {}
                      : { backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }
                    }
                    onMouseEnter={e => { if (section !== s.key) e.currentTarget.style.borderColor = 'var(--border-medium)' }}
                    onMouseLeave={e => { if (section !== s.key) e.currentTarget.style.borderColor = 'var(--border-subtle)' }}
                  >
                    <span className="font-black text-sm uppercase tracking-wider">{s.label}</span>
                    <span className={`text-[9px] font-medium mt-0.5 leading-tight ${section === s.key ? 'opacity-70' : ''}`}
                      style={section === s.key ? {} : ts.textMuted}>
                      {s.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ─ Commentaire ─ */}
            <div className="mb-6">
              <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] mb-3" style={ts.textMuted}>
                <MessageSquare size={10} />
                Ton journal · Optionnel
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder={`"Le générique a défilé, les lumières se rallument — mais le film, lui, mérite mieux que l'oubli. Donne-lui une critique..."`}
                rows={3}
                className="w-full rounded-xl border px-5 py-4 text-sm font-medium leading-relaxed outline-none resize-none transition-colors duration-300 caret-[var(--accent-color)] placeholder-[color:var(--text-muted)] focus:border-[var(--accent-color)]"
                style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* ─ Favoris / Coup de cœur ─ */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={() => setIsFav(v => !v)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all duration-200
                  ${isFav ? 'border-yellow-400/60 text-yellow-500 bg-yellow-400/10' : ''}`}
                style={!isFav ? { backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' } : {}}
                onMouseEnter={e => { if (!isFav) e.currentTarget.style.borderColor = 'var(--border-medium)' }}
                onMouseLeave={e => { if (!isFav) e.currentTarget.style.borderColor = 'var(--border-subtle)' }}
              >
                <Star size={14} className={isFav ? 'fill-yellow-400 text-yellow-500' : ''} />
                Favori
              </button>
              <button
                onClick={() => setIsHeart(v => !v)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all duration-200
                  ${isHeart ? 'border-red-500/60 text-red-500 bg-red-500/10' : ''}`}
                style={!isHeart ? { backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' } : {}}
                onMouseEnter={e => { if (!isHeart) e.currentTarget.style.borderColor = 'var(--border-medium)' }}
                onMouseLeave={e => { if (!isHeart) e.currentTarget.style.borderColor = 'var(--border-subtle)' }}
              >
                <Star size={14} className={isHeart ? 'fill-red-500 text-red-500' : ''} />
                Coup de ❤️
              </button>
            </div>

            {/* ─ Bouton Sauvegarder ─ */}
            <button
              onClick={handleSave}
              disabled={!canSave || saving || saved}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-black text-base uppercase tracking-widest transition-all duration-300
                ${saved
                  ? 'bg-emerald-600 text-white border-2 border-emerald-400'
                  : canSave
                    ? 'hover:-translate-y-1 hover:shadow-2xl active:scale-95'
                    : 'border-2 cursor-not-allowed'
                }`}
              style={
                saved
                  ? {}
                  : canSave
                    ? { backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)', borderColor: 'transparent' }
                    : { backgroundColor: 'transparent', borderColor: 'var(--border-subtle)', color: 'var(--border-medium)' }
              }
            >
              {saving
                ? <><Loader2 size={20} className="animate-spin" /> Archivage en cours…</>
                : saved
                  ? <><Check size={20} strokeWidth={3} /> Film archivé !</>
                  : !canSave
                    ? 'Note + catégorie obligatoires'
                    : <><Clapperboard size={20} /> Archiver ce film</>
              }
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}