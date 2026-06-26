import React, { useState, useEffect, useRef } from 'react';
import {
  Search, X, Star, MessageSquare, Film,
  Clapperboard, Popcorn, Check, ChevronLeft,
  Sparkles, AlertCircle, Loader2, Heart,
  Crown, Award, ThumbsUp, Meh, ThumbsDown, Zap
} from 'lucide-react';
import { addFilm, searchFilms } from '../utils/filmsApi';

function useThemeStyles() {
  return {
    textPrimary:   { color: 'var(--text-primary)' },
    textSecondary: { color: 'var(--text-secondary)' },
    textMuted:     { color: 'var(--text-muted)' },
    textAccent:    { color: 'var(--accent-color)' },
    bgCard:        { backgroundColor: 'var(--card-color)' },
    bgMain:        { backgroundColor: 'var(--bg-color)' },
    borderSubtle:  { borderColor: 'var(--border-subtle)' },
  };
}

const TMDB_IMG    = 'https://image.tmdb.org/t/p/w500';
const TMDB_IMG_SM = 'https://image.tmdb.org/t/p/w200';

// ─── 6 SECTIONS ──────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    key:   'chefdoeuvre',
    label: 'Chef-d\'œuvre',
    icon:  Crown,
    cls:   'bg-yellow-500 text-black border-yellow-300/60',
    desc:  'Parfait. Vu et revu.',
  },
  {
    key:   'elite',
    label: 'Élite',
    icon:  Award,
    cls:   'bg-purple-600 text-white border-purple-400/60',
    desc:  'Excellent. Marqué à vie.',
  },
  {
    key:   'bien',
    label: 'Bien',
    icon:  ThumbsUp,
    cls:   'bg-emerald-600 text-white border-emerald-400/60',
    desc:  'Bon film. Content.',
  },
  {
    key:   'moyen',
    label: 'Moyen',
    icon:  Meh,
    cls:   'bg-amber-500 text-slate-950 border-amber-300/60',
    desc:  'Correct. Sans plus.',
  },
  {
    key:   'decu',
    label: 'Déçu',
    icon:  ThumbsDown,
    cls:   'bg-orange-600 text-white border-orange-400/60',
    desc:  'En dessous des attentes.',
  },
  {
    key:   'navet',
    label: 'Navet',
    icon:  Zap,
    cls:   'bg-rose-600 text-white border-rose-400/60',
    desc:  'Sacrifice. À éviter.',
  },
];

function StarPicker({ value, onChange, ts }) {
  const [hovered, setHovered] = useState(0);
  const labels = ['', 'Catastrophe', 'Décevant', 'Correct', 'Bien', "Chef-d'œuvre"];
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {[1, 2, 3, 4, 5].map(i => {
        const isActive = i <= (hovered || value);
        return (
          <button key={i} type="button"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(i)}
            className="transition-transform duration-150 hover:scale-125 active:scale-110">
            <Star size={24} className="transition-colors duration-150"
              style={{
                color:  isActive ? 'var(--accent-color)' : 'var(--border-medium)',
                fill:   isActive ? 'var(--accent-color)' : 'transparent',
                filter: isActive ? 'drop-shadow(0 0 6px var(--accent-color))' : 'none',
              }} />
          </button>
        );
      })}
      {(hovered || value) > 0 && (
        <span className="ml-1 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--accent-color)' }}>
          {labels[hovered || value]}
        </span>
      )}
    </div>
  );
}

export default function SearchAdd({ onBack, onFilmAdded, currentTheme }) {
  const isLight = currentTheme?.isLight || false;
  const ts = useThemeStyles();

  const [step,         setStep]         = useState('search');
  const [query,        setQuery]        = useState('');
  const [results,      setResults]      = useState([]);
  const [searching,    setSearching]    = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);

  const [rating,   setRating]   = useState(0);
  const [section,  setSection]  = useState('');
  const [comment,  setComment]  = useState('');
  const [isFav,    setIsFav]    = useState(false);
  const [isHeart,  setIsHeart]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState('');

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (step === 'search') setTimeout(() => inputRef.current?.focus(), 100);
  }, [step]);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (query.trim().length < 2) { setResults([]); return; }
    setSearching(true);
    timerRef.current = setTimeout(async () => {
      try {
        const fetched = await searchFilms(query);
        setResults(fetched);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  const handleSelectFilm = (film) => {
    setSelectedFilm(film);
    setStep('form');
    setRating(0); setSection(''); setComment('');
    setIsFav(false); setIsHeart(false);
    setSaved(false); setError('');
  };

  const handleSave = async () => {
    if (!rating || !section) return;
    setSaving(true);
    setError('');
    try {
      const newFilm = await addFilm({ tmdbData: selectedFilm, rating, section, comment, isFavorite: isFav, isHeart });
      setSaved(true);
      setTimeout(() => onFilmAdded?.(newFilm), 700);
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'archivage');
      setSaving(false);
    }
  };

  const canSave = rating > 0 && section !== '';

  // ════════════════════════════════════════════════════════════
  // STEP : SEARCH
  // ════════════════════════════════════════════════════════════
  if (step === 'search') return (
    <div className="flex-1 w-full relative transition-colors duration-700" style={ts.bgMain}>

      {/* Filigranes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Popcorn className="absolute top-[8%] right-[4%] rotate-12"
          style={{ color: 'var(--accent-color)', width: 200, height: 200, opacity: isLight ? 0.06 : 0.04 }} strokeWidth={1} />
        <Film className="absolute bottom-[15%] left-[2%] -rotate-6"
          style={{ color: isLight ? 'var(--text-muted)' : 'white', width: 220, height: 220, opacity: isLight ? 0.04 : 0.03 }} strokeWidth={1} />
      </div>

      {/* ── DESKTOP : layout plein écran sans scroll ── */}
      <div className="hidden lg:flex h-[calc(100vh-90px)] flex-col relative z-10 max-w-[860px] mx-auto px-8 py-8">
        <button onClick={onBack}
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest mb-6 transition-colors duration-200 group w-fit"
          style={ts.textMuted}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          <ChevronLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-1" />
          Retour au dashboard
        </button>

        <h1 className="text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.9] mb-2" style={ts.textPrimary}>
          Quel film
          <span className="ml-3" style={{ color: 'var(--accent-color)' }}>ce soir ?</span>
        </h1>
        <p className="text-sm font-medium mb-6" style={ts.textSecondary}>
          Tape un titre, on s'occupe du reste.
        </p>

        {/* Barre de recherche */}
        <div className="flex items-center gap-4 rounded-2xl border px-6 py-4 mb-5 shrink-0 transition-all duration-300"
          style={{
            backgroundColor: 'var(--card-color)',
            borderColor: 'color-mix(in srgb, var(--accent-color) 30%, transparent)',
            boxShadow: `0 0 0 1px color-mix(in srgb, var(--accent-color) 20%, transparent)`,
          }}>
          {searching
            ? <Loader2 size={20} className="shrink-0 animate-spin" style={{ color: 'var(--accent-color)' }} />
            : <Search size={20} className="shrink-0" style={{ color: 'var(--accent-color)' }} />
          }
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Interstellar, Matrix, Le Dîner de Cons…"
            className="flex-1 bg-transparent text-lg font-bold outline-none caret-[var(--accent-color)] placeholder-[color:var(--text-muted)]"
            style={ts.textPrimary} />
          {query && (
            <button onClick={() => { setQuery(''); setResults([]); }} style={ts.textMuted}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* Résultats desktop — scrollable dans la zone */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {results.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1" style={ts.textMuted}>
                {results.length} résultat{results.length > 1 ? 's' : ''}
              </p>
              {results.map(film => (
                <button key={film.id} onClick={() => handleSelectFilm(film)}
                  className="flex items-center gap-4 rounded-xl border p-3 transition-all duration-300 text-left hover:-translate-y-0.5 hover:shadow-xl group"
                  style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent-color) 40%, transparent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}>
                  {/* Poster en couleur */}
                  <div className="w-12 h-[68px] rounded-lg overflow-hidden shrink-0 border transition-colors duration-300"
                    style={{ borderColor: 'var(--border-subtle)' }}>
                    {film.poster_path
                      ? <img src={`${TMDB_IMG_SM}${film.poster_path}`} alt={film.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      : <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--border-subtle)' }}>
                          <Film size={16} style={ts.textMuted} />
                        </div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-sm uppercase tracking-tight truncate leading-none mb-1" style={ts.textPrimary}>
                      {film.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent-color)' }}>
                        {film.year}
                      </span>
                      {film.genres?.length > 0 && (
                        <span className="text-[10px] font-medium truncate" style={ts.textSecondary}>
                          · {film.genres.slice(0, 3).join(', ')}
                        </span>
                      )}
                    </div>
                    {film.actors?.length > 0 && (
                      <p className="text-[10px] font-medium truncate" style={ts.textSecondary}>
                        Avec : <span style={{ color: 'var(--text-primary)' }}>{film.actors.map(a => a.name).join(', ')}</span>
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:border-[var(--accent-color)]"
                    style={{ borderColor: 'var(--border-subtle)' }}>
                    <Sparkles size={13} style={{ color: 'var(--border-medium)' }} className="group-hover:text-[var(--accent-color)] transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {!searching && query.trim().length >= 2 && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertCircle size={36} className="mb-4" style={{ color: 'var(--border-medium)' }} strokeWidth={1} />
              <p className="font-black text-base uppercase tracking-wider" style={ts.textPrimary}>
                Aucun résultat pour "{query}"
              </p>
              <p className="text-xs mt-2" style={ts.textSecondary}>Vérifie l'orthographe ou essaie en anglais.</p>
            </div>
          )}

          {!query && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Clapperboard size={48} className="mb-4" style={{ color: 'var(--border-subtle)' }} strokeWidth={1} />
              <p className="text-sm font-black uppercase tracking-widest" style={ts.textMuted}>
                Commence à taper pour chercher
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── MOBILE / TABLETTE : scroll normal ── */}
      <div className="lg:hidden relative z-10 max-w-[800px] mx-auto px-4 py-8">
        <button onClick={onBack}
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest mb-6 transition-colors duration-200 group w-fit"
          style={ts.textMuted}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          <ChevronLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-1" />
          Retour
        </button>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase leading-[0.9] mb-2" style={ts.textPrimary}>
          Quel film<br />
          <span style={{ color: 'var(--accent-color)' }}>ce soir ?</span>
        </h1>
        <p className="text-sm font-medium mb-6" style={ts.textSecondary}>Tape un titre, on s'occupe du reste.</p>

        <div className="flex items-center gap-3 rounded-2xl border px-4 py-3 mb-6 transition-all duration-300"
          style={{
            backgroundColor: 'var(--card-color)',
            borderColor: 'color-mix(in srgb, var(--accent-color) 30%, transparent)',
          }}>
          {searching
            ? <Loader2 size={18} className="shrink-0 animate-spin" style={{ color: 'var(--accent-color)' }} />
            : <Search size={18} className="shrink-0" style={{ color: 'var(--accent-color)' }} />
          }
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Interstellar, Matrix…"
            className="flex-1 bg-transparent text-base font-bold outline-none caret-[var(--accent-color)] placeholder-[color:var(--text-muted)] min-w-0"
            style={ts.textPrimary} />
          {query && (
            <button onClick={() => { setQuery(''); setResults([]); }} style={ts.textMuted}>
              <X size={16} />
            </button>
          )}
        </div>

        {results.length > 0 && (
          <div className="flex flex-col gap-2">
            {results.map(film => (
              <button key={film.id} onClick={() => handleSelectFilm(film)}
                className="flex items-center gap-3 rounded-xl border p-3 transition-all duration-300 text-left"
                style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent-color) 40%, transparent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}>
                <div className="w-11 h-[60px] rounded-lg overflow-hidden shrink-0 border" style={{ borderColor: 'var(--border-subtle)' }}>
                  {film.poster_path
                    ? <img src={`${TMDB_IMG_SM}${film.poster_path}`} alt={film.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--border-subtle)' }}>
                        <Film size={14} style={ts.textMuted} />
                      </div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-sm uppercase tracking-tight truncate leading-none mb-1" style={ts.textPrimary}>
                    {film.title}
                  </h3>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent-color)' }}>
                      {film.year}
                    </span>
                    {film.genres?.length > 0 && (
                      <span className="text-[10px] font-medium" style={ts.textSecondary}>
                        · {film.genres.slice(0, 2).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
                <Sparkles size={14} style={{ color: 'var(--border-medium)' }} className="shrink-0" />
              </button>
            ))}
          </div>
        )}

        {!searching && query.trim().length >= 2 && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle size={36} className="mb-4" style={{ color: 'var(--border-medium)' }} strokeWidth={1} />
            <p className="font-black text-sm uppercase tracking-wider" style={ts.textPrimary}>Aucun résultat</p>
            <p className="text-xs mt-1" style={ts.textSecondary}>Essaie en anglais.</p>
          </div>
        )}
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════
  // STEP : FORM — desktop sans scroll, tout visible
  // ════════════════════════════════════════════════════════════
  return (
    <div className="flex-1 w-full relative transition-colors duration-700" style={ts.bgMain}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Clapperboard className="absolute -bottom-10 -right-10"
          style={{ color: isLight ? 'var(--text-muted)' : 'white', width: 280, height: 280, opacity: 0.03 }} strokeWidth={1} />
      </div>

      {/* ── DESKTOP : plein écran sans scroll ── */}
      <div className="hidden lg:flex h-[calc(100vh-90px)] flex-col relative z-10 max-w-[1000px] mx-auto px-8 py-6">
        <button onClick={() => setStep('search')}
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest mb-4 transition-colors duration-200 group w-fit"
          style={ts.textMuted}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          <ChevronLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-1" />
          Changer de film
        </button>

        {/* Layout principal : poster | formulaire */}
        <div className="flex gap-8 flex-1 min-h-0">

          {/* ── Poster ── */}
          <div className="w-[200px] shrink-0 flex flex-col">
            <div className="w-full flex-1 max-h-[340px] rounded-xl overflow-hidden border shadow-2xl"
              style={{ borderColor: 'var(--border-subtle)' }}>
              {selectedFilm.poster_path
                ? <img src={`${TMDB_IMG}${selectedFilm.poster_path}`} alt={selectedFilm.title}
                    className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--border-subtle)' }}>
                    <Film size={40} style={ts.textMuted} />
                  </div>
              }
            </div>
            <div className="mt-3">
              <p className="font-black text-sm uppercase tracking-tight leading-none mb-1" style={ts.textPrimary}>
                {selectedFilm.title}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent-color)' }}>
                {selectedFilm.year}
              </p>
              {selectedFilm.genres?.length > 0 && (
                <p className="text-[10px] mt-1 font-medium" style={ts.textSecondary}>
                  {selectedFilm.genres.slice(0, 3).join(' · ')}
                </p>
              )}
            </div>
          </div>

          {/* ── Formulaire (toutes les sections en une seule colonne dense) ── */}
          <div className="flex-1 min-w-0 flex flex-col min-h-0">

            {/* Eyebrow + titre */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-4 h-px" style={{ backgroundColor: 'var(--accent-color)' }} />
                <span className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: 'var(--accent-color)' }}>
                  Ta critique
                </span>
              </div>
              <h2 className="text-3xl font-black tracking-tighter uppercase leading-[0.9]" style={ts.textPrimary}>
                C'était ta séance.{' '}
                <span style={{ color: 'var(--accent-color)' }}>Verdict ?</span>
              </h2>
            </div>

            {/* Note */}
            <div className="mb-4">
              <label className="block text-[9px] font-black uppercase tracking-[0.2em] mb-2" style={ts.textMuted}>Note / 5</label>
              <StarPicker value={rating} onChange={setRating} ts={ts} />
            </div>

            {/* Catégories — 6 boutons en grille 3×2 compacte */}
            <div className="mb-4">
              <label className="block text-[9px] font-black uppercase tracking-[0.2em] mb-2" style={ts.textMuted}>Catégorie</label>
              <div className="grid grid-cols-3 gap-2">
                {SECTIONS.map(s => {
                  const Icon    = s.icon;
                  const isActive = section === s.key;
                  return (
                    <button key={s.key} type="button"
                      onClick={() => setSection(s.key)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 text-left
                        ${isActive ? s.cls + ' shadow-lg scale-[1.02]' : ''}`}
                      style={!isActive ? { backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' } : {}}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
                      <Icon size={13} className="shrink-0" />
                      <div>
                        <div className="font-black text-[11px] uppercase tracking-wider">{s.label}</div>
                        <div className="text-[9px] font-medium leading-tight opacity-70">{s.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Commentaire */}
            <div className="mb-4 flex-1 min-h-0">
              <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] mb-2" style={ts.textMuted}>
                <MessageSquare size={9} /> Ton avis · Optionnel
              </label>
              <textarea value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Donne-lui une critique..."
                rows={3}
                className="w-full rounded-xl border px-4 py-3 text-sm font-medium leading-relaxed outline-none resize-none transition-colors duration-300 caret-[var(--accent-color)] placeholder-[color:var(--text-muted)] focus:border-[var(--accent-color)]"
                style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} />
            </div>

            {/* Flags + bouton save sur la même ligne */}
            <div className="flex items-center gap-3 flex-wrap mt-auto">
              <button type="button" onClick={() => setIsFav(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all duration-200
                  ${isFav ? 'border-yellow-400/60 text-yellow-500 bg-yellow-400/10' : ''}`}
                style={!isFav ? { backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' } : {}}>
                <Star size={13} className={isFav ? 'fill-yellow-400 text-yellow-500' : ''} />
                Favori
              </button>
              <button type="button" onClick={() => setIsHeart(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all duration-200
                  ${isHeart ? 'border-red-500/60 text-red-500 bg-red-500/10' : ''}`}
                style={!isHeart ? { backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' } : {}}>
                <Heart size={13} className={isHeart ? 'fill-red-500 text-red-500' : ''} />
                Coup de ❤️
              </button>

              {error && (
                <p className="text-xs font-bold text-rose-500 flex items-center gap-1.5">
                  <AlertCircle size={11} /> {error}
                </p>
              )}

              <button type="button" onClick={handleSave}
                disabled={!canSave || saving || saved}
                className={`ml-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300
                  ${saved ? 'bg-emerald-600 text-white'
                    : canSave ? 'hover:-translate-y-0.5 hover:shadow-xl active:scale-95' : 'border-2 cursor-not-allowed'}`}
                style={saved ? {} : canSave
                  ? { backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }
                  : { backgroundColor: 'transparent', borderColor: 'var(--border-subtle)', color: 'var(--border-medium)' }}>
                {saving ? <><Loader2 size={16} className="animate-spin" /> Archivage…</>
                  : saved ? <><Check size={16} strokeWidth={3} /> Archivé !</>
                  : !canSave ? 'Note + catégorie requis'
                  : <><Clapperboard size={16} /> Archiver</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE / TABLETTE ── */}
      <div className="lg:hidden relative z-10 max-w-[900px] mx-auto px-4 py-8">
        <button onClick={() => setStep('search')}
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest mb-6 transition-colors duration-200 group w-fit"
          style={ts.textMuted}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          <ChevronLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-1" />
          Changer de film
        </button>

        <div className="flex gap-4 items-start mb-6">
          {/* Poster mobile en couleur */}
          <div className="w-[100px] shrink-0 aspect-[2/3] rounded-xl overflow-hidden border shadow-xl"
            style={{ borderColor: 'var(--border-subtle)' }}>
            {selectedFilm.poster_path
              ? <img src={`${TMDB_IMG}${selectedFilm.poster_path}`} alt={selectedFilm.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--border-subtle)' }}>
                  <Film size={28} style={ts.textMuted} />
                </div>
            }
          </div>
          <div className="flex-1 pt-1">
            <p className="font-black text-base uppercase tracking-tight leading-tight mb-1" style={ts.textPrimary}>
              {selectedFilm.title}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--accent-color)' }}>
              {selectedFilm.year}
            </p>
            {selectedFilm.genres?.length > 0 && (
              <p className="text-[10px] font-medium" style={ts.textSecondary}>
                {selectedFilm.genres.slice(0, 3).join(' · ')}
              </p>
            )}
          </div>
        </div>

        {/* Formulaire mobile */}
        <div className="mb-5">
          <label className="block text-[9px] font-black uppercase tracking-[0.2em] mb-2" style={ts.textMuted}>Note / 5</label>
          <StarPicker value={rating} onChange={setRating} ts={ts} />
        </div>

        <div className="mb-5">
          <label className="block text-[9px] font-black uppercase tracking-[0.2em] mb-2" style={ts.textMuted}>Catégorie</label>
          <div className="grid grid-cols-2 gap-2">
            {SECTIONS.map(s => {
              const Icon    = s.icon;
              const isActive = section === s.key;
              return (
                <button key={s.key} type="button"
                  onClick={() => setSection(s.key)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-200 text-left
                    ${isActive ? s.cls + ' shadow-lg scale-[1.01]' : ''}`}
                  style={!isActive ? { backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' } : {}}>
                  <Icon size={14} className="shrink-0" />
                  <span className="font-black text-xs uppercase tracking-wider">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-5">
          <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] mb-2" style={ts.textMuted}>
            <MessageSquare size={9} /> Ton avis · Optionnel
          </label>
          <textarea value={comment} onChange={e => setComment(e.target.value)}
            placeholder="Donne-lui une critique..."
            rows={3}
            className="w-full rounded-xl border px-4 py-3 text-sm font-medium leading-relaxed outline-none resize-none transition-colors caret-[var(--accent-color)] placeholder-[color:var(--text-muted)] focus:border-[var(--accent-color)]"
            style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} />
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <button type="button" onClick={() => setIsFav(v => !v)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all
              ${isFav ? 'border-yellow-400/60 text-yellow-500 bg-yellow-400/10' : ''}`}
            style={!isFav ? { backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' } : {}}>
            <Star size={13} className={isFav ? 'fill-yellow-400 text-yellow-500' : ''} />
            Favori
          </button>
          <button type="button" onClick={() => setIsHeart(v => !v)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all
              ${isHeart ? 'border-red-500/60 text-red-500 bg-red-500/10' : ''}`}
            style={!isHeart ? { backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' } : {}}>
            <Heart size={13} className={isHeart ? 'fill-red-500 text-red-500' : ''} />
            Coup de ❤️
          </button>
        </div>

        {error && (
          <p className="text-xs font-bold text-rose-500 mb-4 flex items-center gap-1.5">
            <AlertCircle size={11} /> {error}
          </p>
        )}

        <button type="button" onClick={handleSave}
          disabled={!canSave || saving || saved}
          className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300
            ${saved ? 'bg-emerald-600 text-white'
              : canSave ? 'hover:-translate-y-1 hover:shadow-2xl active:scale-95' : 'border-2 cursor-not-allowed'}`}
          style={saved ? {} : canSave
            ? { backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }
            : { backgroundColor: 'transparent', borderColor: 'var(--border-subtle)', color: 'var(--border-medium)' }}>
          {saving ? <><Loader2 size={18} className="animate-spin" /> Archivage en cours…</>
            : saved ? <><Check size={18} strokeWidth={3} /> Film archivé !</>
            : !canSave ? 'Note + catégorie obligatoires'
            : <><Clapperboard size={18} /> Archiver ce film</>}
        </button>
      </div>
    </div>
  );
}