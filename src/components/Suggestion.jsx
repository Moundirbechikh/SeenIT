import React, { useState, useEffect, useCallback } from 'react';
import {
  Film, Popcorn, Clapperboard, ChevronLeft,
  Plus, X, Check, Loader2, Clock, Calendar,
  Star, Crown, Award, ThumbsUp, Meh, ThumbsDown, Zap,
  Sparkles, Users, AlertCircle, Ticket,
} from 'lucide-react';
import {
  fetchWeeklySuggestions,
  fetchMySuggestion,
  fetchMyFilms,
  addToSuggestion,
  removeFromSuggestion,
} from '../utils/filmsApi';

// --- CONFIG SECTIONS ----------------------------------------------------------
const SECTION_CONFIG = {
  chefdoeuvre: { label: "Chef-d'œuvre", cls: 'bg-yellow-500 text-black border-yellow-300/60 shadow-[0_0_12px_rgba(234,179,8,0.4)]', icon: Crown, color: '#EAB308' },
  elite:       { label: 'Élite',        cls: 'bg-purple-600 text-white border-purple-400/40 shadow-[0_0_12px_rgba(147,51,234,0.5)]', icon: Award, color: '#A855F7' },
  bien:        { label: 'Bien',         cls: 'bg-emerald-600 text-white border-emerald-400/40', icon: ThumbsUp, color: '#10B981' },
  moyen:       { label: 'Moyen',        cls: 'bg-amber-500 text-slate-950 border-amber-300/40', icon: Meh, color: '#F59E0B' },
  decu:        { label: 'Déçu',         cls: 'bg-orange-600 text-white border-orange-400/40',   icon: ThumbsDown, color: '#F97316' },
  navet:       { label: 'Navet',        cls: 'bg-rose-600 text-white border-rose-400/40',       icon: Zap, color: '#F43F5E' },
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
    borderMedium:  { borderColor: 'var(--border-medium)' },
  };
}

const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';

// --- COMPOSANT : Carte film (dans le fan) ------------------------------------
function FilmCard({ film, position, total, isHovered, onHover, onLeave, isLight, isActive, hasActive, onClick }) {
  const sec = SECTION_CONFIG[film.section] || SECTION_CONFIG.moyen;
  const SectionIcon = sec.icon;

  // Calcule la rotation et translation selon la position dans le fan
  let rotation = 0;
  let translateX = 0;
  let translateY = 0;
  let zIndex = 10;

  if (total === 1) {
    rotation = 0; translateX = 0; translateY = 0; zIndex = 20;
  } else if (total === 2) {
    if (position === 0) { rotation = -7;  translateX = -70; translateY = 10;  zIndex = 10; }
    if (position === 1) { rotation = 7;   translateX = 70;  translateY = 10;  zIndex = 20; }
  } else if (total === 3) {
    if (position === 0) { rotation = -12; translateX = -105; translateY = 18; zIndex = 10; }
    if (position === 1) { rotation = 0;   translateX = 0;    translateY = 0;  zIndex = 30; }
    if (position === 2) { rotation = 12;  translateX = 105;  translateY = 18; zIndex = 20; }
  }

  // Comportement au focus (clic) ou au survol (hover)
  const finalScale      = isActive ? 1.15 : (isHovered && !hasActive ? 1.06 : 1);
  const finalTranslateY = isActive ? -30  : (isHovered && !hasActive ? -20 : translateY);
  const finalTranslateX = isActive ? 0    : (isHovered && !hasActive ? 0   : translateX);
  const finalRotation   = isActive ? 0    : (isHovered && !hasActive ? 0   : rotation);
  const finalZIndex     = isActive ? 100  : (isHovered && !hasActive ? 50  : zIndex);

  // Effet de flou pour les autres cartes quand une est active
  const blurEffect    = hasActive && !isActive ? 'blur(6px) brightness(0.5)' : 'blur(0px) brightness(1)';
  const opacityEffect = hasActive && !isActive ? 0.4 : 1;

  return (
    <div
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="absolute cursor-pointer select-none"
      style={{
        width: 180,
        height: 260,
        transform: `translateX(${finalTranslateX}px) translateY(${finalTranslateY}px) rotate(${finalRotation}deg) scale(${finalScale})`,
        zIndex: finalZIndex,
        filter: blurEffect,
        opacity: opacityEffect,
        transition: 'transform 0.7s cubic-bezier(0.34,1.56,0.64,1), filter 0.7s ease, opacity 0.7s ease, z-index 0s',
        left: '50%',
        marginLeft: -90,
        top: 0,
      }}
    >
      {/* Poster */}
      <div
        className="w-full h-full relative overflow-hidden rounded-md border-2 shadow-2xl"
        style={{
          borderColor: isHovered || isActive
            ? sec.color
            : 'rgba(255,255,255,0.12)',
          boxShadow: isHovered || isActive
            ? `0 20px 50px ${sec.color}40, 0 0 0 1px ${sec.color}30`
            : '0 8px 32px rgba(0,0,0,0.5)',
          transition: 'border-color 0.5s, box-shadow 0.5s',
        }}
      >
        {film.posterUrl || film.posterPath ? (
          <img
            src={film.posterUrl || `${TMDB_IMG}${film.posterPath}`}
            alt={film.title}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{ transform: (isHovered || isActive) ? 'scale(1.08)' : 'scale(1)' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--border-subtle)' }}>
            <Film size={40} style={{ color: 'var(--text-muted)' }} strokeWidth={1} />
          </div>
        )}

        {/* Overlay permanent : badge section */}
        <div className={`absolute top-3 left-3 px-2 py-0.5 text-[9px] font-black tracking-tighter rounded-sm uppercase border backdrop-blur-md ${sec.cls}`}>
          {sec.label}
        </div>

        {/* Stars */}
        <div className="absolute top-3 right-3 flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={9} fill={i < film.rating ? 'currentColor' : 'none'}
              style={{ color: i < film.rating ? '#F59E0B' : 'rgba(255,255,255,0.3)' }} />
          ))}
        </div>

        {/* Overlay infos du film (visible au hover ou quand active) */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-4 transition-all duration-700"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 55%, transparent 100%)',
            opacity: (isHovered || isActive) ? 1 : 0,
            transform: (isHovered || isActive) ? 'translateY(0)' : 'translateY(6px)',
          }}
        >
          <h4 className="font-black text-white text-sm uppercase tracking-tighter leading-tight mb-1">
            {film.title}
          </h4>
          <p className="text-[10px] font-bold uppercase tracking-tighter mb-2" style={{ color: sec.color }}>
            {film.year}
          </p>
        </div>
      </div>
    </div>
  );
}

// --- COMPOSANT : Bloc d'un user avec son fan de films -----------------------
function UserSuggestionBlock({ entry, isOwn, isLight, currentTheme }) {
  const ts = useThemeStyles();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeCardIndex, setActiveCardIndex] = useState(null); // Gestion du focus au clic

  const films    = entry.films || [];
  const username = entry.user?.username || 'Cinéphile';
  const initials = username.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  // Hauteur responsive (h-[220px] sur mobile, sm:h-[290px] sur desktop pour le scale)
  const isFanEmpty = films.length === 0;

  const handleCardClick = (index) => {
    // Si on clique sur la carte déjà active, on la désactive, sinon on l'active
    setActiveCardIndex(activeCardIndex === index ? null : index);
  };

  return (
    <div
      className={`relative rounded-2xl border overflow-hidden transition-all duration-700 ${isLight ? 'iconic-card-shimmer' : ''}`}
      style={{
        backgroundColor: 'var(--card-color)',
        borderColor: isOwn
          ? 'color-mix(in srgb, var(--accent-color) 35%, transparent)'
          : 'var(--border-subtle)',
        boxShadow: isOwn ? '0 0 0 1px color-mix(in srgb, var(--accent-color) 20%, transparent)' : 'none',
      }}
    >
      {/* Badge "Ma sélection" */}
      {isOwn && (
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(90deg, transparent, var(--accent-color), transparent)' }}
        />
      )}

      {/* Header user */}
      <div className="flex items-center gap-4 px-5 pt-6 pb-4">
        {/* Avatar */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center border-2 shrink-0 font-black text-sm shadow-sm transition-transform duration-700 hover:scale-105"
          style={{
            backgroundColor: isOwn
              ? 'color-mix(in srgb, var(--accent-color) 20%, transparent)'
              : 'var(--border-subtle)',
            borderColor: isOwn ? 'var(--accent-color)' : 'var(--border-medium)',
            color: isOwn ? 'var(--accent-color)' : 'var(--text-muted)',
          }}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-black text-base uppercase tracking-tighter" style={ts.textPrimary}>
              {username}
            </p>
            {isOwn && (
              <span
                className="text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full border"
                style={{ color: 'var(--accent-color)', borderColor: 'color-mix(in srgb, var(--accent-color) 40%, transparent)', backgroundColor: 'color-mix(in srgb, var(--accent-color) 8%, transparent)' }}
              >
                Toi
              </span>
            )}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-tighter mt-1" style={ts.textMuted}>
            {films.length === 0
              ? 'Aucune sélection'
              : `${films.length} film${films.length > 1 ? 's' : ''} partagé${films.length > 1 ? 's' : ''}`
            }
          </p>
        </div>
      </div>

      {/* Fan de films - Application du scale pour mobile via Tailwind */}
      <div
        className={`relative mx-auto mt-2 transition-all duration-700 ${isFanEmpty ? 'h-[120px]' : 'h-[230px] sm:h-[290px]'}`}
        style={{ width: '100%', maxWidth: 400 }}
      >
        <div className="absolute inset-0 scale-[0.85] sm:scale-100 origin-top transition-transform duration-700">
          {isFanEmpty ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Film size={36} style={{ color: 'var(--border-medium)' }} strokeWidth={1} />
              <p className="text-[10px] font-black uppercase tracking-tighter text-center px-4" style={ts.textMuted}>
                Pas encore de suggestion
              </p>
            </div>
          ) : (
            <>
              {films.map((film, i) => (
                <FilmCard
                  key={film.tmdbId || i}
                  film={film}
                  position={i}
                  total={films.length}
                  isHovered={hoveredIndex === i}
                  isActive={activeCardIndex === i}
                  hasActive={activeCardIndex !== null}
                  onHover={() => setHoveredIndex(i)}
                  onLeave={() => setHoveredIndex(null)}
                  onClick={() => handleCardClick(i)}
                  isLight={isLight}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Ligne de séparation ticket */}
      <div className="relative mx-5 my-5">
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full" style={{ backgroundColor: 'var(--bg-color)' }} />
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full" style={{ backgroundColor: 'var(--bg-color)' }} />
        <div className="border-t-2 border-dashed" style={{ borderColor: 'var(--border-subtle)' }} />
      </div>

      {/* Liste compacte des films sous le fan */}
      {films.length > 0 && (
        <div className="px-5 pb-6 space-y-3">
          {films.map((film, i) => {
            const sec     = SECTION_CONFIG[film.section] || SECTION_CONFIG.moyen;
            const SecIcon = sec.icon;
            return (
              <div key={i} className="flex items-center gap-3 transition-colors duration-500 hover:bg-[var(--bg-color)] p-1 -mx-1 rounded-md">
                <div className="w-6 h-6 shrink-0 flex items-center justify-center rounded-full"
                  style={{ backgroundColor: `${sec.color}20` }}>
                  <SecIcon size={12} style={{ color: sec.color }} />
                </div>
                <p className="font-black text-xs uppercase tracking-tighter truncate flex-1" style={{ color: 'var(--text-primary)' }}>
                  {film.title}
                </p>
                <div className="flex gap-0.5 shrink-0">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={10} fill={j < film.rating ? 'currentColor' : 'none'}
                      style={{ color: j < film.rating ? '#F59E0B' : 'var(--border-medium)' }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- MODAL : Choisir un film depuis mes archives ------------------------------
function AddFilmModal({ myFilms, alreadyAdded, onAdd, onClose, isLight }) {
  const ts = useThemeStyles();
  const [search, setSearch]   = useState('');
  const [adding, setAdding]   = useState(null);

  const filtered = myFilms.filter(f => {
    if (alreadyAdded.includes(f.tmdbId)) return false;
    if (!search.trim()) return true;
    return f.title?.toLowerCase().includes(search.toLowerCase());
  });

  const handleAdd = async (film) => {
    setAdding(film._id);
    await onAdd(film._id);
    setAdding(null);
  };

  return (
    <>
      {/* Styles personnalisés pour la scrollbar du modal */}
      <style dangerouslySetInnerHTML={{__html: `
        .modal-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .modal-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .modal-scrollbar::-webkit-scrollbar-thumb {
          background: color-mix(in srgb, var(--accent-color) 40%, transparent);
          border-radius: 10px;
        }
        .modal-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--accent-color);
        }
      `}} />
      
      <div
        className="fixed inset-0 z-[600] flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
        onClick={onClose}
      >
        <div
          className={`w-full max-w-lg rounded-2xl border flex flex-col overflow-hidden transition-all duration-700 ${isLight ? 'iconic-card-shimmer' : ''}`}
          style={{
            backgroundColor: 'var(--card-color)',
            borderColor: 'var(--border-subtle)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
            maxHeight: '80vh',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header modal */}
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tighter" style={ts.textPrimary}>
                Choisir un film
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-tighter mt-1" style={ts.textMuted}>
                Depuis tes archives personnelles
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center border rounded-full transition-all duration-500 hover:rotate-90 hover:scale-110"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.backgroundColor = 'var(--bg-color)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Search */}
          <div className="p-5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div
              className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-500 focus-within:shadow-[0_0_0_2px_color-mix(in_srgb,var(--accent-color)_20%,transparent)]"
              style={{ backgroundColor: 'var(--bg-color)', borderColor: 'color-mix(in srgb, var(--accent-color) 40%, transparent)' }}
            >
              <Film size={16} style={{ color: 'var(--accent-color)' }} />
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher dans mes films…"
                className="flex-1 bg-transparent text-sm font-semibold outline-none placeholder-[color:var(--text-muted)] tracking-tighter"
                style={{ color: 'var(--text-primary)' }}
              />
              {search && (
                <button onClick={() => setSearch('')} className="transition-colors duration-500 hover:text-[var(--text-primary)]" style={{ color: 'var(--text-muted)' }}>
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Liste films (avec scrollbar custom .modal-scrollbar) */}
          <div className="flex-1 overflow-y-auto p-4 modal-scrollbar">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Film size={40} className="mb-4" style={{ color: 'var(--border-subtle)' }} strokeWidth={1} />
                <p className="text-xs font-black uppercase tracking-tighter" style={ts.textMuted}>
                  {myFilms.length === 0 ? 'Aucun film archivé' : 'Aucun résultat trouvé'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map(film => {
                  const sec     = SECTION_CONFIG[film.section] || SECTION_CONFIG.moyen;
                  const SecIcon = sec.icon;
                  const isAdding = adding === film._id;
                  return (
                    <button
                      key={film._id}
                      onClick={() => handleAdd(film)}
                      disabled={!!adding}
                      className="w-full flex items-center gap-4 rounded-xl border p-3 text-left transition-all duration-700 disabled:opacity-50 group hover:shadow-lg hover:-translate-y-0.5"
                      style={{ backgroundColor: 'transparent', borderColor: 'var(--border-subtle)' }}
                      onMouseEnter={e => { if (!adding) { e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent-color) 50%, transparent)'; e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--accent-color) 5%, transparent)'; } }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {/* Mini poster */}
                      <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 border" style={{ borderColor: 'var(--border-subtle)' }}>
                        {film.posterUrl ? (
                          <img src={film.posterUrl} alt={film.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--border-subtle)' }}>
                            <Film size={14} style={{ color: 'var(--text-muted)' }} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-sm uppercase tracking-tighter truncate transition-colors duration-500 group-hover:text-[var(--accent-color)]" style={ts.textPrimary}>
                          {film.title}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-tighter mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                          {film.year}
                        </p>
                        <div className={`inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 text-[9px] font-black tracking-tighter rounded-sm border uppercase ${sec.cls}`}>
                          <SecIcon size={9} /> {sec.label}
                        </div>
                      </div>
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-700 shrink-0"
                        style={{
                          borderColor: isAdding ? 'var(--accent-color)' : 'var(--border-subtle)',
                          backgroundColor: isAdding ? 'color-mix(in srgb, var(--accent-color) 15%, transparent)' : 'transparent',
                        }}
                      >
                        {isAdding
                          ? <Loader2 size={16} className="animate-spin" style={{ color: 'var(--accent-color)' }} />
                          : <Plus size={16} style={{ color: 'var(--text-muted)' }} className="group-hover:text-[var(--accent-color)] transition-colors duration-500" />
                        }
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// --- COMPOSANT PRINCIPAL ------------------------------------------------------
export default function Suggestion({ onBack, currentTheme, user }) {
  const isLight = currentTheme?.isLight || false;
  const ts = useThemeStyles();

  const [mounted,         setMounted]         = useState(false);
  const [suggestions,     setSuggestions]     = useState([]);
  const [mySuggestion,    setMySuggestion]    = useState(null);
  const [myFilms,         setMyFilms]         = useState([]);
  const [canAdd,          setCanAdd]          = useState(false);
  const [remaining,       setRemaining]       = useState(3);
  const [weekKey,         setWeekKey]         = useState('');
  const [loading,         setLoading]         = useState(true);
  const [showAddModal,    setShowAddModal]    = useState(false);
  const [removing,        setRemoving]        = useState(null);
  const [error,           setError]           = useState('');
  const [successMsg,      setSuccessMsg]      = useState('');

  // -- Chargement ------------------------------------------------------------
  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [weekData, myData, filmsData] = await Promise.all([
        fetchWeeklySuggestions(),
        fetchMySuggestion(),
        fetchMyFilms(),
      ]);
      setSuggestions(weekData.suggestions || []);
      setWeekKey(weekData.weekKey || myData.weekKey || '');
      setMySuggestion(myData.suggestion);
      setCanAdd(myData.canAdd ?? false);
      setRemaining(myData.remaining ?? 3);
      setMyFilms(filmsData);
    } catch (err) {
      setError('Impossible de charger les suggestions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    loadAll();
  }, [loadAll]);

  // -- Ajouter un film -------------------------------------------------------
  const handleAdd = async (userFilmId) => {
    setError('');
    try {
      const data = await addToSuggestion(userFilmId);
      setMySuggestion(data.suggestion);
      setRemaining(data.remaining);
      if (data.remaining === 0) setCanAdd(false);
      setSuggestions(prev => {
        const userId = user?._id || user?.id;
        const idx = prev.findIndex(s => s.user._id === userId);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], films: data.suggestion.films };
          return next;
        }
        return [{
          user: { _id: userId, username: user?.username || 'Toi' },
          films: data.suggestion.films,
          isOwn: true,
        }, ...prev];
      });
      setShowAddModal(false);
      setSuccessMsg('Film ajouté à ta sélection !');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'ajout');
    }
  };

  // -- Retirer un film -------------------------------------------------------
  const handleRemove = async (tmdbId) => {
    setRemoving(tmdbId);
    setError('');
    try {
      await removeFromSuggestion(tmdbId);
      setMySuggestion(prev => {
        if (!prev) return prev;
        const nextFilms = prev.films.filter(f => f.tmdbId !== tmdbId);
        return { ...prev, films: nextFilms };
      });
      setRemaining(r => r + 1);
      setCanAdd(true);
      setSuggestions(prev => {
        const userId = user?._id || user?.id;
        return prev.map(s => {
          if (s.user._id === userId) {
            return { ...s, films: s.films.filter(f => f.tmdbId !== tmdbId) };
          }
          return s;
        });
      });
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
    } finally {
      setRemoving(null);
    }
  };

  // -- Films déjà dans ma sélection (pour le modal) --------------------------
  const alreadyAddedTmdbIds = (mySuggestion?.films || []).map(f => f.tmdbId);

  // -- Semaine formatée ------------------------------------------------------
  const weekDisplay = weekKey
    ? new Date(weekKey).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
    : '';

  // -- Tri : ma sélection en premier ----------------------------------------
  const sortedSuggestions = [...suggestions].sort((a, b) => {
    if (a.isOwn) return -1;
    if (b.isOwn) return 1;
    return 0;
  });

  const othersOnly = sortedSuggestions.filter(s => !s.isOwn);

  return (
    <div className="flex-1 w-full relative min-h-screen transition-colors duration-1000" style={ts.bgMain}>

      {/* Filigranes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Ticket className="absolute top-[8%] right-[3%] rotate-12"
          style={{ color: 'var(--accent-color)', width: 200, height: 200, opacity: isLight ? 0.06 : 0.04 }} strokeWidth={1} />
        <Film className="absolute bottom-[12%] left-[2%] -rotate-12"
          style={{ color: isLight ? 'var(--text-muted)' : 'white', width: 220, height: 220, opacity: isLight ? 0.04 : 0.03 }} strokeWidth={1} />
        <Popcorn className="absolute top-[50%] right-[8%] rotate-6"
          style={{ color: 'var(--accent-color)', width: 140, height: 140, opacity: isLight ? 0.04 : 0.02 }} strokeWidth={1} />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 py-8">

        {/* Retour */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-tighter mb-8 transition-all duration-500 group w-fit"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <ChevronLeft size={16} className="transition-transform duration-500 tracking-widest group-hover:-translate-x-1" />
            Retour
          </button>
        )}

        {/* -- En-tête ------------------------------------------------------- */}
        <div className={`mb-10 transform transition-all duration-1000 ease-out ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9] mb-4"
                style={{ color: 'var(--text-primary)' }}>
                SUGGESTIONS
                <br />
                <span className="inline-block py-2  shadow-2xl mt-1" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }}>
                  DE LA SEMAINE.
                </span>
              </h1>
              <p className="text-sm font-semibold max-w-lg mt-2" style={{ color: 'var(--text-secondary)' }}>
                Partage jusqu'à 3 films que tu as vus avec la communauté. Tu peux ajuster ta sélection n'importe quel jour de la semaine !
              </p>
            </div>

            {/* Infos semaine + bouton ajouter */}
            <div className="flex flex-col gap-3 shrink-0">
              <div
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-[11px] font-black uppercase tracking-tighter transition-all duration-500 ${isLight ? 'iconic-card-shimmer' : ''}`}
                style={{
                  backgroundColor: canAdd
                    ? 'color-mix(in srgb, var(--accent-color) 10%, transparent)'
                    : 'var(--card-color)',
                  borderColor: canAdd
                    ? 'color-mix(in srgb, var(--accent-color) 40%, transparent)'
                    : 'var(--border-subtle)',
                  color: canAdd ? 'var(--accent-color)' : 'var(--text-muted)',
                }}
              >
                <Clock size={14} />
                {canAdd
                  ? `${remaining} ajout${remaining > 1 ? 's' : ''} restant${remaining > 1 ? 's' : ''}`
                  : 'Quota de la semaine atteint'
                }
              </div>

              {weekDisplay && (
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter px-1" style={{ color: 'var(--text-muted)' }}>
                  <Calendar size={12} />
                  Semaine du {weekDisplay}
                </div>
              )}

              {/* Bouton ajouter principal */}
              {canAdd && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-6 py-3.5 mt-1 rounded-xl font-black text-sm uppercase tracking-tighter transition-all duration-700 hover:-translate-y-1 hover:shadow-xl active:scale-95"
                  style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }}
                >
                  <Plus size={18} strokeWidth={2.5} />
                  Ajouter un film
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 h-0.5 w-full rounded-full" style={{ backgroundColor: 'var(--border-subtle)' }} />
        </div>

        {/* Messages */}
        {successMsg && (
          <div
            className="flex items-center gap-3 px-5 py-4 rounded-xl mb-6 border text-sm font-black uppercase tracking-tighter transition-all duration-700"
            style={{ backgroundColor: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.3)', color: '#10B981' }}
          >
            <Check size={18} strokeWidth={2.5} /> {successMsg}
          </div>
        )}
        {error && (
          <div
            className="flex items-center gap-3 px-5 py-4 rounded-xl mb-6 border text-sm font-black uppercase tracking-tighter transition-all duration-700"
            style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}
          >
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* -- Loading -------------------------------------------------------- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 transition-opacity duration-1000">
            <Loader2 size={40} className="animate-spin mb-4" style={{ color: 'var(--accent-color)' }} />
            <p className="text-[11px] font-black uppercase tracking-tighter" style={{ color: 'var(--text-muted)' }}>
              Chargement des suggestions…
            </p>
          </div>
        ) : (
          <>
            {/* -- MA SÉLECTION ------------------------------------------------ */}
            <div className={`mb-16 transform transition-all duration-1000 delay-200 ease-out ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {/* -- Desktop : affichage 2 colonnes */}
              <div className="grid lg:grid-cols-[1fr_340px] gap-8">

                {/* Bloc ma sélection */}
                <UserSuggestionBlock
                  entry={{
                    user: {
                      _id: user?._id || user?.id,
                      username: user?.username || user?.email?.split('@')[0] || 'Moi',
                    },
                    films: mySuggestion?.films || [],
                    isOwn: true,
                  }}
                  isOwn={true}
                  isLight={isLight}
                  currentTheme={currentTheme}
                />

                {/* Panneau gestion ma sélection */}
                <div
                  className={`rounded-2xl border p-6 flex flex-col transition-all duration-700 hover:shadow-lg ${isLight ? 'iconic-card-shimmer' : ''}`}
                  style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)' }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Clapperboard size={16} style={{ color: 'var(--accent-color)' }} />
                    <span className="text-[11px] font-black uppercase tracking-tighter" style={{ color: 'var(--accent-color)' }}>
                      Gérer ma sélection
                    </span>
                  </div>

                  {/* Films déjà ajoutés */}
                  {(mySuggestion?.films || []).length === 0 ? (
                    <div className="text-center py-10 flex-1">
                      <Film size={36} className="mx-auto mb-4" style={{ color: 'var(--border-medium)' }} strokeWidth={1} />
                      <p className="text-xs font-black uppercase tracking-tighter" style={{ color: 'var(--text-muted)' }}>
                        Ajoute jusqu'à 3 films
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 mb-6 flex-1">
                      {(mySuggestion?.films || []).map((film, i) => {
                        const sec     = SECTION_CONFIG[film.section] || SECTION_CONFIG.moyen;
                        const SecIcon = sec.icon;
                        const isRemoving = removing === film.tmdbId;
                        return (
                          <div
                            key={film.tmdbId}
                            className="flex items-center gap-3 p-3 rounded-xl border group transition-all duration-500 hover:-translate-y-0.5 hover:shadow-md"
                            style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-color)' }}
                          >
                            <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0 border" style={{ borderColor: 'var(--border-subtle)' }}>
                              {film.posterUrl || film.posterPath ? (
                                <img
                                  src={film.posterUrl || `${TMDB_IMG}${film.posterPath}`}
                                  alt={film.title}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--border-subtle)' }}>
                                  <Film size={12} style={{ color: 'var(--text-muted)' }} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-xs uppercase tracking-tighter truncate transition-colors duration-500 group-hover:text-[var(--accent-color)]" style={{ color: 'var(--text-primary)' }}>
                                {film.title}
                              </p>
                              <div className={`inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-tighter rounded-sm border ${sec.cls}`}>
                                <SecIcon size={8} /> {sec.label}
                              </div>
                            </div>
                            {/* Bouton retirer */}
                            <button
                              onClick={() => handleRemove(film.tmdbId)}
                              disabled={!!removing}
                              className="w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-500 opacity-0 group-hover:opacity-100 disabled:opacity-30 hover:rotate-90 hover:scale-110"
                              style={{ borderColor: 'rgba(239,68,68,0.4)', color: '#ef4444' }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              {isRemoving
                                ? <Loader2 size={12} className="animate-spin" />
                                : <X size={14} />
                              }
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Bouton ajouter dans le panneau */}
                  {canAdd && (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="w-full flex items-center justify-center gap-2 py-3.5 mt-auto rounded-xl border font-black text-xs uppercase tracking-tighter transition-all duration-700 hover:-translate-y-1 hover:shadow-lg"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--accent-color) 10%, transparent)',
                        borderColor: 'color-mix(in srgb, var(--accent-color) 40%, transparent)',
                        color: 'var(--accent-color)',
                      }}
                    >
                      <Plus size={14} strokeWidth={2.5} />
                      Ajouter un film ({remaining})
                    </button>
                  )}

                  {/* Message quota atteint */}
                  {!canAdd && (
                    <div
                      className="flex items-start gap-3 p-4 rounded-xl mt-auto transition-all duration-700"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--accent-color) 6%, transparent)', borderColor: 'color-mix(in srgb, var(--accent-color) 20%, transparent)' }}
                    >
                      <Clock size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--accent-color)' }} />
                      <p className="text-[10px] font-bold leading-relaxed tracking-tight" style={{ color: 'var(--text-secondary)' }}>
                        Tu as atteint la limite de 3 films. Modifie ta liste ou reviens dimanche pour une nouvelle semaine !
                      </p>
                    </div>
                  )}

                  {/* Règles */}
                  <div className="mt-6 pt-5 border-t transition-colors duration-700" style={{ borderColor: 'var(--border-subtle)' }}>
                    <p className="text-[9px] font-black uppercase tracking-tighter mb-3" style={{ color: 'var(--text-muted)' }}>
                      Règles
                    </p>
                    <ul className="space-y-2">
                      {[
                        'Max 3 films par semaine',
                        'Ajout libre tout au long de la semaine',
                        'Reset automatique chaque dimanche',
                      ].map((rule, i) => (
                        <li key={i} className="flex items-center gap-2 text-[10px] font-bold tracking-tight" style={{ color: 'var(--text-muted)' }}>
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--accent-color)', opacity: 0.7 }} />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* -- SUGGESTIONS DES AUTRES ------------------------------------ */}
            {othersOnly.length > 0 && (
              <div className={`transform transition-all duration-1000 delay-400 ease-out ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <Users size={16} style={{ color: 'var(--text-muted)' }} />
                  <h2 className="text-sm font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
                    Sélections de la communauté
                  </h2>
                  <div
                    className="text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full border transition-colors duration-500"
                    style={{ color: 'var(--accent-color)', borderColor: 'color-mix(in srgb, var(--accent-color) 30%, transparent)', backgroundColor: 'color-mix(in srgb, var(--accent-color) 8%, transparent)' }}
                  >
                    {othersOnly.length} cinéphile{othersOnly.length > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {othersOnly.map((entry, i) => (
                    <div
                      key={entry._id || i}
                      className="transform transition-all duration-1000 ease-out hover:-translate-y-1"
                      style={{ transitionDelay: `${i * 80}ms`, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)' }}
                    >
                      <UserSuggestionBlock
                        entry={entry}
                        isOwn={false}
                        isLight={isLight}
                        currentTheme={currentTheme}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state global */}
            {suggestions.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-24 text-center transition-opacity duration-1000">
                <div
                  className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6 border shadow-sm transition-transform duration-700 hover:scale-105 ${isLight ? 'iconic-card-shimmer' : ''}`}
                  style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)' }}
                >
                  <Ticket size={40} style={{ color: 'var(--border-medium)' }} strokeWidth={1} />
                </div>
                <p className="font-black text-xl uppercase tracking-tighter mb-3" style={{ color: 'var(--text-primary)' }}>
                  Aucune suggestion cette semaine
                </p>
                <p className="text-sm font-medium mb-8 max-w-sm tracking-tight" style={{ color: 'var(--text-secondary)' }}>
                  Sois le premier à partager tes coups de cœur cinéma de la semaine avec la communauté.
                </p>
                {canAdd && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-tighter transition-all duration-700 hover:-translate-y-1 hover:shadow-xl"
                    style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }}
                  >
                    <Plus size={18} strokeWidth={2.5} /> Ajouter mon premier film
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* -- Modal ajout ----------------------------------------------------- */}
      {showAddModal && (
        <AddFilmModal
          myFilms={myFilms}
          alreadyAdded={alreadyAddedTmdbIds}
          onAdd={handleAdd}
          onClose={() => setShowAddModal(false)}
          isLight={isLight}
        />
      )}
    </div>
  );
}