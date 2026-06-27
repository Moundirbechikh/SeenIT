import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Film, Popcorn, Clapperboard, SlidersHorizontal,
  Star, Heart, ChevronLeft, Loader2, Plus,
  Search, X, Crown, Zap, ThumbsDown, Meh, ThumbsUp, Award,
  CalendarDays, Calendar
} from 'lucide-react';
import MovieCard from '../components/MovieCard';

export const SECTION_CONFIG = {
  chefdoeuvre: {
    label: 'Chef-d\'œuvre', short: 'C.D\'Œ',
    cls:   'border-yellow-400/70 text-yellow-300 bg-yellow-500/15',
    icon:  Crown, desc: 'Parfait. À voir absolument.', color: '#EAB308',
  },
  elite: {
    label: 'Élite', short: 'ÉLITE',
    cls:   'border-purple-500/60 text-purple-300 bg-purple-600/15',
    icon:  Award, desc: 'Excellent. Marqué à vie.', color: '#A855F7',
  },
  bien: {
    label: 'Bien', short: 'BIEN',
    cls:   'border-emerald-500/60 text-emerald-300 bg-emerald-600/15',
    icon:  ThumbsUp, desc: 'Bon film. Content de l\'avoir vu.', color: '#10B981',
  },
  moyen: {
    label: 'Moyen', short: 'MOYEN',
    cls:   'border-amber-400/60 text-amber-300 bg-amber-500/15',
    icon:  Meh, desc: 'Correct. Pas de regrets, pas d\'ovation.', color: '#F59E0B',
  },
  decu: {
    label: 'Déçu', short: 'DÉÇU',
    cls:   'border-orange-500/60 text-orange-300 bg-orange-600/15',
    icon:  ThumbsDown, desc: 'En dessous des espérances.', color: '#F97316',
  },
  navet: {
    label: 'Navet', short: 'NAVET',
    cls:   'border-rose-500/60 text-rose-300 bg-rose-600/15',
    icon:  Zap, desc: 'Tu t\'es sacrifié. Noté pour ne plus recommencer.', color: '#F43F5E',
  },
};

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

function getYearBounds(films) {
  const years = films.map(f => parseInt(f.year)).filter(y => !isNaN(y));
  if (years.length === 0) return { min: 1970, max: new Date().getFullYear() };
  return { min: Math.min(...years), max: Math.max(...years) };
}

function filterByPeriod(films, period) {
  if (period === 'tous') return films;
  const now   = new Date();
  const start = new Date();
  if (period === 'today')      start.setHours(0, 0, 0, 0);
  else if (period === 'week')  start.setDate(now.getDate() - 7);
  else if (period === 'month') start.setMonth(now.getMonth() - 1);
  else if (period === 'year')  start.setFullYear(now.getFullYear() - 1);
  return films.filter(f => new Date(f.watchedAt) >= start);
}

export default function Films({
  films = [], loading, initialFilter = 'tous',
  initialActorSearch = '',    // 🆕 nom d'acteur pré-rempli depuis le dashboard
  onBack, onToggle, onGoToSearch, currentTheme,
}) {
  const isLight = currentTheme?.isLight || false;
  const ts = useThemeStyles();
  const topRef    = useRef(null);
  const searchRef = useRef(null);

  const [filter,      setFilter]      = useState(initialFilter);
  const [searchQuery, setSearchQuery] = useState(initialActorSearch); // 🆕 pré-rempli
  const [showSearch,  setShowSearch]  = useState(!!initialActorSearch); // 🆕 ouvert si acteur
  const [period,      setPeriod]      = useState('tous');

  const validFilms = useMemo(() => films.filter(Boolean), [films]);
  const { min: yearMin, max: yearMax } = useMemo(() => getYearBounds(validFilms), [validFilms]);

  const [yearFrom, setYearFrom] = useState(yearMin);
  const [yearTo,   setYearTo]   = useState(yearMax);

  useEffect(() => { setYearFrom(yearMin); setYearTo(yearMax); }, [yearMin, yearMax]);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  useEffect(() => { setFilter(initialFilter); }, [initialFilter]);

  // 🆕 Si initialActorSearch change (nouveau click sur acteur depuis dashboard)
  useEffect(() => {
    if (initialActorSearch) {
      setSearchQuery(initialActorSearch);
      setShowSearch(true);
    }
  }, [initialActorSearch]);

  useEffect(() => {
    if (showSearch) setTimeout(() => searchRef.current?.focus(), 100);
  }, [showSearch]);

  const filtered = useMemo(() => {
    let result = validFilms;
    if (filter === 'favorite')      result = result.filter(f => f.isFavorite);
    else if (filter === 'heart')    result = result.filter(f => f.isHeart);
    else if (filter !== 'tous')     result = result.filter(f => f.section === filter);
    result = filterByPeriod(result, period);
    result = result.filter(f => {
      const y = parseInt(f.year);
      return isNaN(y) || (y >= yearFrom && y <= yearTo);
    });
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      result = result.filter(f =>
        f.title?.toLowerCase().includes(q) ||
        f.synopsis?.toLowerCase().includes(q) ||
        (f.genres || []).some(g => g.toLowerCase().includes(q)) ||
        (f.actors || []).some(a => a.name?.toLowerCase().includes(q)) ||
        f.director?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [validFilms, filter, period, yearFrom, yearTo, searchQuery]);

  const totalFilms  = validFilms.length;
  const eliteCount  = validFilms.filter(f => f.section === 'elite' || f.section === 'chefdoeuvre').length;
  const moyenneNote = totalFilms > 0
    ? (validFilms.reduce((a, f) => a + (f.rating || 0), 0) / totalFilms).toFixed(1)
    : '0.0';

  const SECTION_FILTERS = Object.entries(SECTION_CONFIG).map(([key, cfg]) => ({
    key,
    label: cfg.label,
    count: validFilms.filter(f => f.section === key).length,
    color: cfg.color,
  }));

  const PERIOD_OPTIONS = [
    { key: 'tous',  label: 'Toutes périodes' },
    { key: 'today', label: 'Aujourd\'hui' },
    { key: 'week',  label: 'Cette semaine' },
    { key: 'month', label: 'Ce mois' },
    { key: 'year',  label: 'Cette année' },
  ];

  const yearRange      = yearMax - yearMin;
  const showYearFilter = yearRange > 2;

  // 🆕 Indicateur : on est en mode "filtre acteur"
  const isActorSearch = !!initialActorSearch && searchQuery === initialActorSearch;

  return (
    <div ref={topRef} className="flex-1 w-full relative min-h-screen transition-colors duration-700" style={ts.bgMain}>

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Popcorn className="absolute top-[8%] right-[4%] rotate-12"
          style={{ color: 'var(--accent-color)', width: 220, height: 220, opacity: isLight ? 0.06 : 0.04 }} strokeWidth={1} />
        <Clapperboard className="absolute bottom-[12%] left-[3%] -rotate-6"
          style={{ color: 'var(--accent-color)', width: 180, height: 180, opacity: isLight ? 0.06 : 0.04 }} strokeWidth={1} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-10">

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

        {/* En-tête */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
            <div>
              {/* 🆕 Titre dynamique si filtre acteur */}
              {isActorSearch ? (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--accent-color)' }}>
                    Films avec
                  </p>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9] mb-2" style={{ color: 'var(--text-primary)' }}>
                    {initialActorSearch}
                  </h1>
                </div>
              ) : (
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9] mb-2" style={{ color: 'var(--text-primary)' }}>
                  Films <br className="sm:hidden" />DÉJÀ
                  <span className="py-2 inline-block mt-1 sm:mt-2 ml-2 sm:ml-3 px-2 shadow-xl"
                    style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }}>
                    VUS
                  </span>
                </h1>
              )}
              <p className="text-sm font-medium max-w-md mt-2" style={{ color: 'var(--text-secondary)' }}>
                {isActorSearch
                  ? `${filtered.length} film${filtered.length > 1 ? 's' : ''} archivé${filtered.length > 1 ? 's' : ''} avec ${initialActorSearch}`
                  : 'Ton archive personnelle. Chaque film noté, critiqué, immortalisé.'
                }
              </p>
            </div>

            <div className="flex items-stretch gap-0 border divide-x shrink-0 self-start sm:self-auto"
              style={{ borderColor: 'var(--border-subtle)' }}>
              {[
                { value: totalFilms,        label: 'Films vus' },
                { value: eliteCount,        label: '★ Top' },
                { value: `${moyenneNote}★`, label: 'Moy.' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center justify-center px-4 sm:px-5 py-2.5 sm:py-3"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--card-color) 40%, transparent)' }}>
                  <span className="text-xl sm:text-2xl font-black leading-none mb-0.5" style={{ color: 'var(--text-primary)' }}>{value}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 sm:mt-7 h-px w-full" style={{ backgroundColor: 'var(--border-subtle)' }} />
        </div>

        {/* Barre de recherche */}
        <div className="mb-4">
          {showSearch ? (
            <div className="flex items-center gap-3 rounded-xl border px-4 py-2.5 transition-all duration-300"
              style={{
                backgroundColor: 'var(--card-color)',
                borderColor: isActorSearch
                  ? '#C9960C'
                  : 'color-mix(in srgb, var(--accent-color) 40%, transparent)',
                boxShadow: isActorSearch
                  ? '0 0 0 1px rgba(201,150,12,0.3)'
                  : '0 0 0 1px color-mix(in srgb, var(--accent-color) 20%, transparent)',
              }}>
              <Search size={16} style={{ color: isActorSearch ? '#C9960C' : 'var(--accent-color)' }} className="shrink-0" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Titre, acteur, genre, réalisateur…"
                className="flex-1 bg-transparent text-sm font-medium outline-none placeholder-[color:var(--text-muted)] min-w-0"
                style={{ color: 'var(--text-primary)', caretColor: 'var(--accent-color)' }}
              />
              <button onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border text-[11px] font-black uppercase tracking-widest transition-all duration-200 hover:opacity-80"
              style={{ backgroundColor: 'transparent', borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
              <Search size={12} />
              <span className="hidden sm:inline">Rechercher dans mes films</span>
              <span className="sm:hidden">Rechercher</span>
            </button>
          )}
        </div>

        {/* Filtres catégorie */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <SlidersHorizontal size={13} className="shrink-0" style={{ color: 'var(--text-muted)' }} />
            <button
              onClick={() => setFilter('tous')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider border transition-all duration-200"
              style={{
                backgroundColor: filter === 'tous' ? 'var(--accent-color)' : 'transparent',
                color:           filter === 'tous' ? 'var(--text-inverse)' : 'var(--text-secondary)',
                borderColor:     filter === 'tous' ? 'var(--accent-color)' : 'var(--border-subtle)',
              }}>
              Tous
              <span className="text-[9px] px-1 py-0.5 rounded font-black" style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}>
                {totalFilms}
              </span>
            </button>
            <button
              onClick={() => setFilter('favorite')}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider border transition-all duration-200 ${filter === 'favorite' ? 'border-yellow-400/60 text-yellow-300 bg-yellow-400/15' : ''}`}
              style={filter !== 'favorite' ? { backgroundColor: 'transparent', color: 'var(--text-secondary)', borderColor: 'var(--border-subtle)' } : {}}>
              <Star size={10} className={filter === 'favorite' ? 'fill-yellow-400 text-yellow-400' : 'opacity-60'} />
              <span className="hidden sm:inline">Favoris</span>
              <span className="sm:hidden">★</span>
              <span className="text-[9px] px-1 py-0.5 rounded font-black" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                {validFilms.filter(f => f.isFavorite).length}
              </span>
            </button>
            <button
              onClick={() => setFilter('heart')}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider border transition-all duration-200 ${filter === 'heart' ? 'border-red-500/60 text-red-300 bg-red-500/15' : ''}`}
              style={filter !== 'heart' ? { backgroundColor: 'transparent', color: 'var(--text-secondary)', borderColor: 'var(--border-subtle)' } : {}}>
              <Heart size={10} className={filter === 'heart' ? 'fill-red-400 text-red-400' : 'opacity-60'} />
              <span className="hidden sm:inline">Coups de ❤️</span>
              <span className="sm:hidden">❤️</span>
              <span className="text-[9px] px-1 py-0.5 rounded font-black" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                {validFilms.filter(f => f.isHeart).length}
              </span>
            </button>
            <div className="w-px h-4 self-center" style={{ backgroundColor: 'var(--border-subtle)' }} />
            {SECTION_FILTERS.map(({ key, label, count }) => {
              const isActive = filter === key;
              const cfg = SECTION_CONFIG[key];
              return (
                <button key={key}
                  onClick={() => setFilter(isActive ? 'tous' : key)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider border transition-all duration-200 ${isActive ? cfg.cls : ''}`}
                  style={!isActive ? { backgroundColor: 'transparent', color: 'var(--text-secondary)', borderColor: 'var(--border-subtle)' } : {}}>
                  <span className="sm:hidden">{cfg.short}</span>
                  <span className="hidden sm:inline">{label}</span>
                  <span className="text-[9px] px-1 py-0.5 rounded font-black"
                    style={{ backgroundColor: isActive ? 'rgba(0,0,0,0.15)' : 'var(--border-subtle)' }}>
                    {count}
                  </span>
                </button>
              );
            })}
            {onGoToSearch && (
              <button onClick={onGoToSearch}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--accent-color) 10%, transparent)',
                  borderColor:     'color-mix(in srgb, var(--accent-color) 40%, transparent)',
                  color:           'var(--accent-color)',
                }}>
                <Plus size={12} strokeWidth={2.5} />
                <span className="hidden sm:inline">Ajouter</span>
              </button>
            )}
          </div>
        </div>

        {/* Filtres période + années */}
        <div className="mb-8 sm:mb-10 flex flex-wrap gap-3 items-start">
          <div className="flex items-center gap-1.5 flex-wrap">
            <CalendarDays size={13} className="shrink-0" style={{ color: 'var(--text-muted)' }} />
            {PERIOD_OPTIONS.map(({ key, label }) => (
              <button key={key}
                onClick={() => setPeriod(key)}
                className="px-2.5 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider border transition-all duration-200"
                style={{
                  backgroundColor: period === key ? 'color-mix(in srgb, var(--accent-color) 15%, transparent)' : 'transparent',
                  color:           period === key ? 'var(--accent-color)' : 'var(--text-secondary)',
                  borderColor:     period === key ? 'color-mix(in srgb, var(--accent-color) 50%, transparent)' : 'var(--border-subtle)',
                }}>
                <span className="sm:hidden">
                  {key === 'tous' ? 'Tout' : key === 'today' ? 'Auj.' : key === 'week' ? 'Sem.' : key === 'month' ? 'Mois' : 'An'}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
          {showYearFilter && (
            <div className="flex items-center gap-2 flex-wrap ml-0 sm:ml-2">
              <Calendar size={13} className="shrink-0" style={{ color: 'var(--text-muted)' }} />
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Sortie :</span>
              <div className="flex items-center gap-1.5">
                <input type="number" value={yearFrom} min={yearMin} max={yearTo}
                  onChange={e => setYearFrom(Math.max(yearMin, Math.min(yearTo, parseInt(e.target.value) || yearMin)))}
                  className="w-16 sm:w-20 rounded-lg border text-center text-[11px] font-bold py-1 outline-none focus:border-[var(--accent-color)]"
                  style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} />
                <span className="text-[11px] font-black" style={{ color: 'var(--text-muted)' }}>→</span>
                <input type="number" value={yearTo} min={yearFrom} max={yearMax}
                  onChange={e => setYearTo(Math.min(yearMax, Math.max(yearFrom, parseInt(e.target.value) || yearMax)))}
                  className="w-16 sm:w-20 rounded-lg border text-center text-[11px] font-bold py-1 outline-none focus:border-[var(--accent-color)]"
                  style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} />
                {(yearFrom !== yearMin || yearTo !== yearMax) && (
                  <button
                    onClick={() => { setYearFrom(yearMin); setYearTo(yearMax); }}
                    className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border transition-all"
                    style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}
          {(filter !== 'tous' || period !== 'tous' || searchQuery || yearFrom !== yearMin || yearTo !== yearMax) && (
            <button
              onClick={() => { setFilter('tous'); setPeriod('tous'); setSearchQuery(''); setYearFrom(yearMin); setYearTo(yearMax); setShowSearch(false); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest border rounded-lg transition-all"
              style={{ borderColor: 'rgba(239,68,68,0.4)', color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.05)' }}>
              <X size={10} /> Tout effacer
            </button>
          )}
        </div>

        {filtered.length !== totalFilms && (
          <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
            {filtered.length} résultat{filtered.length > 1 ? 's' : ''} sur {totalFilms}
          </p>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Loader2 size={40} className="animate-spin mb-4" style={{ color: 'var(--accent-color)' }} />
            <p className="font-black text-sm uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Chargement de tes archives…
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 sm:py-28 text-center">
            <Film size={56} className="mb-4" style={{ color: 'var(--border-medium)' }} strokeWidth={1} />
            <p className="font-black text-base sm:text-lg uppercase tracking-wider mb-2" style={{ color: 'var(--text-primary)' }}>
              {totalFilms === 0 ? 'Aucun film archivé' : isActorSearch ? `Aucun film avec ${initialActorSearch}` : 'Aucun résultat'}
            </p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              {totalFilms === 0
                ? 'Archive ton premier film pour commencer.'
                : isActorSearch
                  ? 'Cet acteur n\'est pas encore dans ton archive.'
                  : 'Essaie de modifier les filtres.'}
            </p>
            {totalFilms === 0 && onGoToSearch && (
              <button onClick={onGoToSearch}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all hover:-translate-y-0.5 hover:shadow-xl"
                style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }}>
                <Plus size={16} /> Ajouter mon premier film
              </button>
            )}
          </div>
        ) : (
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