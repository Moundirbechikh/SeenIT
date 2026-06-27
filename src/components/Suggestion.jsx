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

// ─── CONFIG SECTIONS ──────────────────────────────────────────────────────────
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

// ─── HELPER : Prochain mardi/mercredi matin ───────────────────────────────────
function getNextAddWindow() {
  const now  = new Date();
  const day  = now.getDay();
  const hour = now.getHours();
  if (day === 2) return null; // C'est mardi
  if (day === 3 && hour < 12) return null; // C'est mercredi matin
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  if (day === 3 && hour >= 12) return 'mardi prochain';
  if (day < 2) {
    const diff = 2 - day;
    return diff === 0 ? "aujourd'hui" : diff === 1 ? 'demain (mardi)' : `${days[2]}`;
  }
  return 'mardi prochain';
}

// ─── COMPOSANT : Carte film (dans le fan) ────────────────────────────────────
function FilmCard({ film, position, total, isHovered, onHover, onLeave, isLight }) {
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

  // Hover : la carte s'élève
  const hoverRotation    = isHovered ? 0 : rotation;
  const hoverTranslateY  = isHovered ? -20 : translateY;
  const hoverTranslateX  = isHovered ? 0   : translateX;
  const hoverZIndex      = isHovered ? 50  : zIndex;
  const hoverScale       = isHovered ? 1.06 : 1;

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="absolute cursor-pointer select-none"
      style={{
        width: 180,
        height: 260,
        transform: `translateX(${hoverTranslateX}px) translateY(${hoverTranslateY}px) rotate(${hoverRotation}deg) scale(${hoverScale})`,
        zIndex: hoverZIndex,
        transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1), z-index 0s',
        left: '50%',
        marginLeft: -90,
        top: 0,
      }}
    >
      {/* Poster */}
      <div
        className="w-full h-full relative overflow-hidden border-2 shadow-2xl"
        style={{
          borderColor: isHovered
            ? sec.color
            : 'rgba(255,255,255,0.12)',
          boxShadow: isHovered
            ? `0 20px 50px ${sec.color}40, 0 0 0 1px ${sec.color}30`
            : '0 8px 32px rgba(0,0,0,0.5)',
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}
      >
        {film.posterUrl || film.posterPath ? (
          <img
            src={film.posterUrl || `${TMDB_IMG}${film.posterPath}`}
            alt={film.title}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--border-subtle)' }}>
            <Film size={40} style={{ color: 'var(--text-muted)' }} strokeWidth={1} />
          </div>
        )}

        {/* Overlay permanent : badge section */}
        <div className={`absolute top-3 left-3 px-2 py-0.5 text-[9px] font-black tracking-[0.15em] uppercase border backdrop-blur-md ${sec.cls}`}>
          {sec.label}
        </div>

        {/* Stars */}
        <div className="absolute top-3 right-3 flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={9} fill={i < film.rating ? 'currentColor' : 'none'}
              style={{ color: i < film.rating ? '#F59E0B' : 'rgba(255,255,255,0.3)' }} />
          ))}
        </div>

        {/* Overlay hover : infos du film */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-4 transition-all duration-400"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 55%, transparent 100%)',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(6px)',
          }}
        >
          <h4 className="font-black text-white text-sm uppercase tracking-tight leading-tight mb-1">
            {film.title}
          </h4>
          <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: sec.color }}>
            {film.year}
          </p>
          {film.actors?.length > 0 && (
            <div className="space-y-0.5">
              {film.actors.slice(0, 2).map((a, i) => (
                <p key={i} className="text-[8px] text-white/60 font-medium truncate">
                  {a.name}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── COMPOSANT : Bloc d'un user avec son fan de films ───────────────────────
function UserSuggestionBlock({ entry, isOwn, isLight, currentTheme }) {
  const ts = useThemeStyles();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const films    = entry.films || [];
  const username = entry.user?.username || 'Cinéphile';
  // Initiales
  const initials = username.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  // Hauteur du fan : dépend du nombre de films
  const fanHeight = films.length === 0 ? 120 : 290;

  return (
    <div
      className={`relative rounded-2xl border overflow-hidden transition-all duration-500 ${isLight ? 'iconic-card-shimmer' : ''}`}
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
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg, transparent, var(--accent-color), transparent)' }}
        />
      )}

      {/* Header user */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 font-black text-sm"
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
            <p className="font-black text-sm uppercase tracking-tight" style={ts.textPrimary}>
              {username}
            </p>
            {isOwn && (
              <span
                className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border"
                style={{ color: 'var(--accent-color)', borderColor: 'color-mix(in srgb, var(--accent-color) 40%, transparent)', backgroundColor: 'color-mix(in srgb, var(--accent-color) 8%, transparent)' }}
              >
                Toi
              </span>
            )}
          </div>
          <p className="text-[9px] font-bold uppercase tracking-widest mt-0.5" style={ts.textMuted}>
            {films.length === 0
              ? 'Aucune sélection cette semaine'
              : `${films.length} film${films.length > 1 ? 's' : ''} recommandé${films.length > 1 ? 's' : ''}`
            }
          </p>
        </div>
        {/* Count badge */}
        {films.length > 0 && (
          <div
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm border"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--accent-color) 12%, transparent)',
              borderColor: 'color-mix(in srgb, var(--accent-color) 30%, transparent)',
              color: 'var(--accent-color)',
            }}
          >
            {films.length}
          </div>
        )}
      </div>

      {/* Fan de films */}
      <div
        className="relative mx-auto"
        style={{ height: fanHeight, width: '100%', maxWidth: 400 }}
      >
        {films.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <Film size={32} style={{ color: 'var(--border-medium)' }} strokeWidth={1} />
            <p className="text-[10px] font-black uppercase tracking-widest text-center px-4" style={ts.textMuted}>
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
                onHover={() => setHoveredIndex(i)}
                onLeave={() => setHoveredIndex(null)}
                isLight={isLight}
              />
            ))}
          </>
        )}
      </div>

      {/* Ligne de séparation ticket */}
      <div className="relative mx-5 my-4">
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full" style={{ backgroundColor: 'var(--bg-color)' }} />
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full" style={{ backgroundColor: 'var(--bg-color)' }} />
        <div className="border-t border-dashed" style={{ borderColor: 'var(--border-subtle)' }} />
      </div>

      {/* Liste compacte des films sous le fan */}
      {films.length > 0 && (
        <div className="px-5 pb-5 space-y-2">
          {films.map((film, i) => {
            const sec     = SECTION_CONFIG[film.section] || SECTION_CONFIG.moyen;
            const SecIcon = sec.icon;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 shrink-0 flex items-center justify-center rounded-full"
                  style={{ backgroundColor: `${sec.color}20` }}>
                  <SecIcon size={10} style={{ color: sec.color }} />
                </div>
                <p className="font-black text-xs uppercase tracking-tight truncate flex-1" style={{ color: 'var(--text-primary)' }}>
                  {film.title}
                </p>
                <div className="flex gap-0.5 shrink-0">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={8} fill={j < film.rating ? 'currentColor' : 'none'}
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

// ─── MODAL : Choisir un film depuis mes archives ──────────────────────────────
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
    <div
      className="fixed inset-0 z-[600] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-2xl border flex flex-col overflow-hidden ${isLight ? 'iconic-card-shimmer' : ''}`}
        style={{
          backgroundColor: 'var(--card-color)',
          borderColor: 'var(--border-subtle)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          maxHeight: '80vh',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header modal */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div>
            <h3 className="text-base font-black uppercase tracking-tight" style={ts.textPrimary}>
              Choisir un film
            </h3>
            <p className="text-[9px] font-bold uppercase tracking-widest mt-0.5" style={ts.textMuted}>
              Depuis tes archives
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border rounded-full transition-all hover:rotate-90"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div
            className="flex items-center gap-3 rounded-xl border px-3 py-2"
            style={{ backgroundColor: 'var(--bg-color)', borderColor: 'color-mix(in srgb, var(--accent-color) 30%, transparent)' }}
          >
            <Film size={14} style={{ color: 'var(--accent-color)' }} />
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher dans mes films…"
              className="flex-1 bg-transparent text-sm font-medium outline-none placeholder-[color:var(--text-muted)]"
              style={{ color: 'var(--text-primary)' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ color: 'var(--text-muted)' }}>
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Liste films */}
        <div className="flex-1 overflow-y-auto p-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Film size={32} className="mb-3" style={{ color: 'var(--border-medium)' }} strokeWidth={1} />
              <p className="text-xs font-black uppercase tracking-wider" style={ts.textMuted}>
                {myFilms.length === 0 ? 'Aucun film archivé' : 'Aucun résultat'}
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {filtered.map(film => {
                const sec     = SECTION_CONFIG[film.section] || SECTION_CONFIG.moyen;
                const SecIcon = sec.icon;
                const isAdding = adding === film._id;
                return (
                  <button
                    key={film._id}
                    onClick={() => handleAdd(film)}
                    disabled={!!adding}
                    className="w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 disabled:opacity-50 group"
                    style={{ backgroundColor: 'transparent', borderColor: 'var(--border-subtle)' }}
                    onMouseEnter={e => { if (!adding) e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent-color) 40%, transparent)'; }}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                  >
                    {/* Mini poster */}
                    <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0 border" style={{ borderColor: 'var(--border-subtle)' }}>
                      {film.posterUrl ? (
                        <img src={film.posterUrl} alt={film.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--border-subtle)' }}>
                          <Film size={12} style={{ color: 'var(--text-muted)' }} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-xs uppercase tracking-tight truncate" style={ts.textPrimary}>
                        {film.title}
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent-color)' }}>
                        {film.year}
                      </p>
                      <div className={`inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 text-[8px] font-black tracking-wide border uppercase ${sec.cls}`}>
                        <SecIcon size={7} /> {sec.label}
                      </div>
                    </div>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center border transition-all shrink-0"
                      style={{
                        borderColor: isAdding ? 'var(--accent-color)' : 'var(--border-subtle)',
                        backgroundColor: isAdding ? 'color-mix(in srgb, var(--accent-color) 15%, transparent)' : 'transparent',
                      }}
                    >
                      {isAdding
                        ? <Loader2 size={12} className="animate-spin" style={{ color: 'var(--accent-color)' }} />
                        : <Plus size={12} style={{ color: 'var(--text-muted)' }} className="group-hover:text-[var(--accent-color)] transition-colors" />
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
  );
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
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

  const nextWindow = getNextAddWindow();

  // ── Chargement ────────────────────────────────────────────────────────────
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

  // ── Ajouter un film ───────────────────────────────────────────────────────
  const handleAdd = async (userFilmId) => {
    setError('');
    try {
      const data = await addToSuggestion(userFilmId);
      setMySuggestion(data.suggestion);
      setRemaining(data.remaining);
      if (data.remaining === 0) setCanAdd(false);
      // Met à jour la liste globale
      setSuggestions(prev => {
        const userId = user?._id || user?.id;
        const idx = prev.findIndex(s => s.user._id === userId);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], films: data.suggestion.films };
          return next;
        }
        // Ajoute une nouvelle entrée
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

  // ── Retirer un film ───────────────────────────────────────────────────────
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

  // ── Films déjà dans ma sélection (pour le modal) ──────────────────────────
  const alreadyAddedTmdbIds = (mySuggestion?.films || []).map(f => f.tmdbId);

  // ── Semaine formatée ──────────────────────────────────────────────────────
  const weekDisplay = weekKey
    ? new Date(weekKey).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
    : '';

  // ── Tri : ma sélection en premier ────────────────────────────────────────
  const sortedSuggestions = [...suggestions].sort((a, b) => {
    if (a.isOwn) return -1;
    if (b.isOwn) return 1;
    return 0;
  });

  // ── Sépare les autres suggestions de la mienne ───────────────────────────
  const othersOnly = sortedSuggestions.filter(s => !s.isOwn);

  return (
    <div className="flex-1 w-full relative min-h-screen transition-colors duration-700" style={ts.bgMain}>

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
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest mb-8 transition-all duration-200 group w-fit"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <ChevronLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-1" />
            Retour
          </button>
        )}

        {/* ── En-tête ─────────────────────────────────────────────────────── */}
        <div className={`mb-8 transform transition-all duration-1000 ease-out ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-px" style={{ backgroundColor: 'var(--accent-color)' }} />
                <span className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: 'var(--accent-color)' }}>
                  Sélection de la semaine
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9] mb-3"
                style={{ color: 'var(--text-primary)' }}>
                SUGGESTIONS
                <br />
                <span className="inline-block py-1 px-2 shadow-2xl mt-1" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }}>
                  DU MARDI
                </span>
              </h1>
              <p className="text-sm font-medium max-w-lg" style={{ color: 'var(--text-secondary)' }}>
                Partage jusqu'à 3 films que tu as vus avec la communauté — chaque semaine, du mardi au mercredi matin.
              </p>
            </div>

            {/* Infos semaine + bouton ajouter */}
            <div className="flex flex-col gap-3 shrink-0">
              {/* Fenêtre d'ajout */}
              <div
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${isLight ? 'iconic-card-shimmer' : ''}`}
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
                <Clock size={12} />
                {canAdd
                  ? `${remaining} ajout${remaining > 1 ? 's' : ''} restant${remaining > 1 ? 's' : ''}`
                  : nextWindow
                    ? `Prochain ajout : ${nextWindow}`
                    : 'Cette semaine est terminée'
                }
              </div>

              {weekDisplay && (
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  <Calendar size={10} />
                  Semaine du {weekDisplay}
                </div>
              )}

              {/* Bouton ajouter */}
              {canAdd && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
                  style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }}
                >
                  <Plus size={16} strokeWidth={2.5} />
                  Ajouter un film
                </button>
              )}
            </div>
          </div>

          {/* Ligne de séparation */}
          <div className="mt-6 h-px w-full" style={{ backgroundColor: 'var(--border-subtle)' }} />
        </div>

        {/* Messages */}
        {successMsg && (
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6 border text-sm font-bold"
            style={{ backgroundColor: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.3)', color: '#10B981' }}
          >
            <Check size={14} strokeWidth={2.5} /> {successMsg}
          </div>
        )}
        {error && (
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6 border text-sm font-bold"
            style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}
          >
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {/* ── Loading ──────────────────────────────────────────────────────── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 size={36} className="animate-spin mb-4" style={{ color: 'var(--accent-color)' }} />
            <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Chargement des suggestions…
            </p>
          </div>
        ) : (
          <>
            {/* ── MA SÉLECTION ──────────────────────────────────────────────── */}
            <div className={`mb-12 transform transition-all duration-1000 delay-200 ease-out ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="flex items-center gap-3 mb-5">
                <Sparkles size={14} style={{ color: 'var(--accent-color)' }} />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
                  Ma sélection
                </h2>
              </div>

              {/* ── Desktop : affichage 2 colonnes (ma selection + contrôle) */}
              <div className="grid lg:grid-cols-[1fr_320px] gap-6">

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
                  className={`rounded-2xl border p-5 ${isLight ? 'iconic-card-shimmer' : ''}`}
                  style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)' }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Clapperboard size={13} style={{ color: 'var(--accent-color)' }} />
                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--accent-color)' }}>
                      Gérer ma sélection
                    </span>
                  </div>

                  {/* Films déjà ajoutés */}
                  {(mySuggestion?.films || []).length === 0 ? (
                    <div className="text-center py-8">
                      <Film size={28} className="mx-auto mb-3" style={{ color: 'var(--border-medium)' }} strokeWidth={1} />
                      <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                        {canAdd ? "Ajoute jusqu'à 3 films" : 'Aucune sélection cette semaine'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 mb-4">
                      {(mySuggestion?.films || []).map((film, i) => {
                        const sec     = SECTION_CONFIG[film.section] || SECTION_CONFIG.moyen;
                        const SecIcon = sec.icon;
                        const isRemoving = removing === film.tmdbId;
                        return (
                          <div
                            key={film.tmdbId}
                            className="flex items-center gap-3 p-2.5 rounded-xl border group transition-all duration-200"
                            style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-color)' }}
                          >
                            {/* Mini poster */}
                            <div className="w-9 h-12 rounded-lg overflow-hidden shrink-0 border" style={{ borderColor: 'var(--border-subtle)' }}>
                              {film.posterUrl || film.posterPath ? (
                                <img
                                  src={film.posterUrl || `${TMDB_IMG}${film.posterPath}`}
                                  alt={film.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--border-subtle)' }}>
                                  <Film size={10} style={{ color: 'var(--text-muted)' }} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-xs uppercase tracking-tight truncate" style={{ color: 'var(--text-primary)' }}>
                                {film.title}
                              </p>
                              <div className={`inline-flex items-center gap-0.5 mt-0.5 px-1 py-0.5 text-[7px] font-black uppercase border ${sec.cls}`}>
                                <SecIcon size={6} /> {sec.label}
                              </div>
                            </div>
                            {/* Bouton retirer — seulement si canAdd (fenêtre ouverte) */}
                            {canAdd && (
                              <button
                                onClick={() => handleRemove(film.tmdbId)}
                                disabled={!!removing}
                                className="w-6 h-6 flex items-center justify-center rounded-full border transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30"
                                style={{ borderColor: 'rgba(239,68,68,0.4)', color: '#ef4444' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                {isRemoving
                                  ? <Loader2 size={10} className="animate-spin" />
                                  : <X size={10} />
                                }
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Bouton ajouter dans le panneau */}
                  {canAdd && (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border font-black text-xs uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--accent-color) 10%, transparent)',
                        borderColor: 'color-mix(in srgb, var(--accent-color) 40%, transparent)',
                        color: 'var(--accent-color)',
                      }}
                    >
                      <Plus size={13} strokeWidth={2.5} />
                      Ajouter un film ({remaining} restant{remaining > 1 ? 's' : ''})
                    </button>
                  )}

                  {/* Message fenêtre fermée */}
                  {!canAdd && (
                    <div
                      className="flex items-start gap-2 p-3 rounded-xl mt-2"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--accent-color) 6%, transparent)', borderColor: 'color-mix(in srgb, var(--accent-color) 20%, transparent)' }}
                    >
                      <Clock size={12} className="mt-0.5 shrink-0" style={{ color: 'var(--accent-color)' }} />
                      <p className="text-[9px] font-bold leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {nextWindow
                          ? `Tu pourras modifier ta sélection ${nextWindow}.`
                          : 'La fenêtre d\'ajout est fermée pour cette semaine.'
                        }
                      </p>
                    </div>
                  )}

                  {/* Règles */}
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <p className="text-[8px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                      Règles
                    </p>
                    <ul className="space-y-1">
                      {[
                        'Max 3 films par semaine',
                        'Ajout : mardi toute la journée',
                        'Ajout : mercredi avant 12h',
                        'Reset chaque dimanche à minuit',
                      ].map((rule, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-[9px] font-medium" style={{ color: 'var(--text-muted)' }}>
                          <div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: 'var(--accent-color)', opacity: 0.5 }} />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* ── SUGGESTIONS DES AUTRES ──────────────────────────────────── */}
            {othersOnly.length > 0 && (
              <div className={`transform transition-all duration-1000 delay-400 ease-out ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <div className="flex items-center gap-3 mb-5">
                  <Users size={14} style={{ color: 'var(--text-muted)' }} />
                  <h2 className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
                    Sélections de la communauté
                  </h2>
                  <div
                    className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border"
                    style={{ color: 'var(--accent-color)', borderColor: 'color-mix(in srgb, var(--accent-color) 30%, transparent)', backgroundColor: 'color-mix(in srgb, var(--accent-color) 8%, transparent)' }}
                  >
                    {othersOnly.length} cinéphile{othersOnly.length > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {othersOnly.map((entry, i) => (
                    <div
                      key={entry._id || i}
                      className="transform transition-all duration-700 ease-out"
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
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border ${isLight ? 'iconic-card-shimmer' : ''}`}
                  style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)' }}
                >
                  <Ticket size={32} style={{ color: 'var(--border-medium)' }} strokeWidth={1} />
                </div>
                <p className="font-black text-lg uppercase tracking-widest mb-2" style={{ color: 'var(--text-primary)' }}>
                  Aucune suggestion cette semaine
                </p>
                <p className="text-sm mb-6 max-w-xs" style={{ color: 'var(--text-secondary)' }}>
                  Sois le premier à partager tes coups de cœur cinéma de la semaine.
                </p>
                {canAdd && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all hover:-translate-y-0.5 hover:shadow-xl"
                    style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }}
                  >
                    <Plus size={16} /> Ajouter mon premier film
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modal ajout ───────────────────────────────────────────────────── */}
      {showAddModal && (
        <AddFilmModal
          myFilms={myFilms}
          alreadyAdded={alreadyAddedTmdbIds}
          onAdd={handleAdd}
          onClose={() => setShowAddModal(false)}
          isLight={isLight}
        />
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}