import React, { useState, useEffect, useRef } from 'react';
import { Film, Popcorn, Clapperboard, SlidersHorizontal, Star, Heart, ChevronLeft, Loader2, Plus } from 'lucide-react';
import MovieCard from '../components/MovieCard';

function useThemeStyles(isLight) {
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

const sectionColors = {
  elite:    'border-purple-500/60 text-purple-300 bg-purple-600/15',
  moyen:    'border-amber-400/60  text-amber-300  bg-amber-500/15',
  navet:    'border-rose-500/60   text-rose-300   bg-rose-600/15',
  favorite: 'border-yellow-400/60 text-yellow-300 bg-yellow-400/15',
  heart:    'border-red-500/60    text-red-300    bg-red-500/15',
};

export default function Films({ films = [], loading, initialFilter = 'tous', onBack, onToggle, onGoToSearch, currentTheme }) {
  const isLight = currentTheme?.isLight || false;
  const ts = useThemeStyles(isLight);
  const [filter, setFilter] = useState(initialFilter);
  const topRef = useRef(null);

  // Scroll en haut à chaque fois qu'on arrive sur cette page
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Sync si initialFilter change (navigation depuis dashboard)
  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  const validFilms = films.filter(Boolean);
  const totalFilms  = validFilms.length;
  const eliteCount  = validFilms.filter(f => f.section === 'elite').length;
  const moyenneNote = totalFilms > 0
    ? (validFilms.reduce((a, f) => a + (f.rating || 0), 0) / totalFilms).toFixed(1)
    : '0.0';

  const FILTERS = [
    { key: 'tous',     label: 'Tous',        count: validFilms.length },
    { key: 'favorite', label: 'Favoris',     count: validFilms.filter(f => f.isFavorite).length, icon: Star },
    { key: 'heart',    label: 'Coups de ❤️', count: validFilms.filter(f => f.isHeart).length,    icon: Heart },
    { key: 'elite',    label: 'Élite',       count: validFilms.filter(f => f.section === 'elite').length },
    { key: 'moyen',    label: 'Moyen',       count: validFilms.filter(f => f.section === 'moyen').length },
    { key: 'navet',    label: 'Navet',       count: validFilms.filter(f => f.section === 'navet').length },
  ];

  const filtered =
    filter === 'tous'     ? validFilms :
    filter === 'favorite' ? validFilms.filter(f => f.isFavorite) :
    filter === 'heart'    ? validFilms.filter(f => f.isHeart) :
    validFilms.filter(f => f.section === filter);

  return (
    <div ref={topRef} className="flex-1 w-full relative min-h-screen transition-colors duration-700" style={ts.bgMain}>
      {/* Filigranes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Popcorn className="absolute top-[8%] right-[4%] rotate-12"
          style={{ color: 'var(--accent-color)', width: 220, height: 220, opacity: isLight ? 0.06 : 0.04 }} strokeWidth={1} />
        <Clapperboard className="absolute bottom-[12%] left-[3%] -rotate-6"
          style={{ color: 'var(--accent-color)', width: 180, height: 180, opacity: isLight ? 0.06 : 0.04 }} strokeWidth={1} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Bouton retour */}
        {onBack && (
          <button onClick={onBack}
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest mb-6 sm:mb-8 transition-all duration-200 group w-fit"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            <ChevronLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-1" />
            Retour au dashboard
          </button>
        )}

        {/* En-tête — VISIBLE EN PREMIER sur mobile */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9] mb-2" style={ts.textPrimary}>
                Films <br className="sm:hidden" />DÉJÀ
                <span className="py-2 inline-block mt-1 sm:mt-2 ml-2 sm:ml-3 px-2 shadow-xl"
                  style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }}>
                  VUS
                </span>
              </h1>
              <p className="text-sm font-medium max-w-md mt-2" style={ts.textSecondary}>
                Ton archive personnelle. Chaque film noté, critiqué, immortalisé.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-stretch gap-0 border divide-x shrink-0 self-start sm:self-auto"
              style={{ borderColor: 'var(--border-subtle)' }}>
              {[
                { value: totalFilms,        label: 'Films vus' },
                { value: eliteCount,        label: 'Élites' },
                { value: `${moyenneNote}★`, label: 'Moy. note' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center justify-center px-4 sm:px-6 py-3"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--card-color) 40%, transparent)' }}>
                  <span className="text-xl sm:text-2xl font-black leading-none mb-0.5" style={ts.textPrimary}>{value}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest" style={ts.textMuted}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 sm:mt-8 h-px w-full" style={{ backgroundColor: 'var(--border-subtle)' }} />
        </div>

        {/* Filtres + bouton ajouter */}
        <div className="flex items-center gap-2 mb-8 sm:mb-10 flex-wrap">
          <SlidersHorizontal size={14} className="shrink-0" style={ts.textMuted} />
          {FILTERS.map(({ key, label, count, icon: Icon }) => {
            const isActive = filter === key;
            return (
              <button key={key} onClick={() => setFilter(key)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] font-black uppercase tracking-wider border transition-all duration-200
                  ${isActive && key !== 'tous' ? sectionColors[key] || '' : ''}
                  ${isActive && key === 'tous' ? 'shadow-md' : ''}`}
                style={{
                  backgroundColor: isActive && key === 'tous' ? 'var(--accent-color)' : isActive ? '' : 'transparent',
                  color: isActive && key === 'tous' ? 'var(--text-inverse)' : isActive ? '' : 'var(--text-secondary)',
                  borderColor: isActive && key === 'tous' ? 'var(--accent-color)' : isActive ? '' : 'var(--border-subtle)',
                }}>
                {Icon && <Icon size={11} className={isActive ? '' : 'opacity-60'} />}
                {label}
                <span className="text-[9px] px-1.5 py-0.5 rounded font-black"
                  style={{ backgroundColor: isActive ? 'rgba(0,0,0,0.1)' : 'var(--border-subtle)' }}>
                  {count}
                </span>
              </button>
            );
          })}

          {/* Bouton ajouter film */}
          {onGoToSearch && (
            <button onClick={onGoToSearch}
              className="ml-auto flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] font-black uppercase tracking-widest border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--accent-color) 10%, transparent)',
                borderColor: 'color-mix(in srgb, var(--accent-color) 40%, transparent)',
                color: 'var(--accent-color)',
              }}>
              <Plus size={13} strokeWidth={2.5} />
              <span className="hidden sm:inline">Ajouter</span>
            </button>
          )}
        </div>

        {/* Grille */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Loader2 size={40} className="animate-spin mb-4" style={{ color: 'var(--accent-color)' }} />
            <p className="font-black text-sm uppercase tracking-wider" style={ts.textMuted}>Chargement de tes archives…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 sm:py-32 text-center">
            <Film size={64} className="mb-4" style={{ color: 'var(--border-medium)' }} strokeWidth={1} />
            <p className="font-black text-lg sm:text-xl uppercase tracking-wider mb-2" style={ts.textPrimary}>
              {filter === 'tous' ? 'Aucun film archivé' : 'Aucun film dans cette catégorie'}
            </p>
            <p className="text-sm mt-1 mb-6" style={ts.textSecondary}>
              {filter === 'tous' ? 'Archive ton premier film pour commencer.' : 'Continue à noter des films.'}
            </p>
            {filter === 'tous' && onGoToSearch && (
              <button onClick={onGoToSearch}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all hover:-translate-y-0.5 hover:shadow-xl"
                style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }}>
                <Plus size={16} /> Ajouter mon premier film
              </button>
            )}
          </div>
        ) : (
          /* Cards : flex-wrap sur desktop, colonne sur mobile */
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6" style={{ alignItems: 'flex-start' }}>
            {filtered.map((film, index) => (
              <MovieCard
                key={film._id || `${film.title}-${index}`}
                {...film}
                currentTheme={currentTheme}
                onToggleFavorite={() => onToggle(film._id, 'isFavorite')}
                onToggleHeart={() => onToggle(film._id, 'isHeart')}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}