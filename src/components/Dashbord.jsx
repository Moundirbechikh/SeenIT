
import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Clapperboard, Film, Popcorn,
  Star, Heart, Trophy, Mic2,
  ArrowRight, Stamp, Camera, Hand, ChevronRight, Crown, Loader2,
  Award, ThumbsUp, Meh, ThumbsDown, Zap, Sparkles, Ticket
} from 'lucide-react';
import { fetchGoldActors } from '../utils/filmsApi';

const TMDB_IMG    = 'https://image.tmdb.org/t/p/w500';
const TMDB_IMG_SM = 'https://image.tmdb.org/t/p/w200';

const SECTION_COLORS = {
  chefdoeuvre: { label: "Chef-d'œuvre", cls: 'bg-yellow-500 text-black border-yellow-300/60 shadow-[0_0_12px_rgba(234,179,8,0.4)]', icon: Crown },
  elite:       { label: 'Élite',        cls: 'bg-purple-600 text-white border-purple-400/40 shadow-[0_0_12px_rgba(147,51,234,0.5)]', icon: Award },
  bien:        { label: 'Bien',         cls: 'bg-emerald-600 text-white border-emerald-400/40', icon: ThumbsUp },
  moyen:       { label: 'Moyen',        cls: 'bg-amber-500 text-slate-950 border-amber-300/40', icon: Meh },
  decu:        { label: 'Déçu',         cls: 'bg-orange-600 text-white border-orange-400/40',   icon: ThumbsDown },
  navet:       { label: 'Navet',        cls: 'bg-rose-600 text-white border-rose-400/40',       icon: Zap },
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

function formatWatchedAt(dateStr) {
  if (!dateStr) return 'Récemment';
  const date     = new Date(dateStr);
  const now      = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier soir';
  if (diffDays < 7)  return `Il y a ${diffDays} jours`;
  if (diffDays < 14) return 'La semaine passée';
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
}

export default function Dashboard({
  onGoToSearch, onGoToFilms, onGoToFilmsByActor, onGoToSuggestions,
  currentTheme, user, stats, films = [], loading
}) {
  const isLight = currentTheme?.isLight || false;
  const ts = useThemeStyles();

  const rawUserName  = user?.username || (user?.email ? user.email.split('@')[0] : null) || 'Cinéphile';
  let   userName     = rawUserName;
  const nameParts    = rawUserName.trim().split(/\s+/);
  if (nameParts.length >= 2) {
    const [first, second] = nameParts;
    if (first.length > 6 && second.length > 3) {
      userName = `${first.charAt(0).toUpperCase()}.${second.charAt(0).toUpperCase()}${second.slice(1)}`;
    }
  }

  const totalFilms       = stats?.total            || 0;
  const chefdoeuvreCount = stats?.chefdoeuvreCount || 0;
  const eliteCount       = stats?.eliteCount       || 0;
  const topCount         = chefdoeuvreCount + eliteCount;
  const heartCount       = stats?.heartCount       || 0;
  const favCount         = stats?.favCount         || 0;
  const favoriteGenre    = stats?.favoriteGenre    || '—';

  const rawLastFilm = stats?.lastFilm || null;
  const lastFilm = rawLastFilm ? {
    title:     rawLastFilm.title,
    year:      rawLastFilm.year,
    rating:    rawLastFilm.rating    || 3,
    section:   rawLastFilm.section   || 'moyen',
    posterUrl: rawLastFilm.posterPath ? `${TMDB_IMG}${rawLastFilm.posterPath}` : '',
    watchedAt: formatWatchedAt(rawLastFilm.watchedAt),
    comment:   rawLastFilm.comment   || '',
  } : null;

  const heartFilmsList = (stats?.heartFilms || []).map(f => ({
    title:     f.title, year: f.year,
    rating:    f.rating  || 3,
    section:   f.section || 'moyen',
    posterUrl: f.posterPath ? `${TMDB_IMG}${f.posterPath}` : '',
    watchedAt: formatWatchedAt(f.watchedAt),
    comment:   f.comment || '',
  }));

  const actorMap = {};
  films.filter(Boolean).forEach(film => {
    (film.actors || []).forEach(actor => {
      if (!actor.name) return;
      if (!actorMap[actor.name]) actorMap[actor.name] = { ...actor, count: 0 };
      actorMap[actor.name].count++;
    });
  });
  const favoriteActorEntry = Object.values(actorMap).sort((a, b) => b.count - a.count)[0] || null;
  const favoriteActor      = favoriteActorEntry?.name || '—';
  const favoriteActorImg   = favoriteActorEntry?.img  || '';

  const [goldActors,    setGoldActors]    = useState([]);
  const [goldIndex,     setGoldIndex]     = useState(0);
  const [goldLoaded,    setGoldLoaded]    = useState(false);

  useEffect(() => {
    fetchGoldActors()
      .then(actors => { setGoldActors(actors); setGoldLoaded(true); })
      .catch(() => setGoldLoaded(true));
  }, []);

  useEffect(() => {
    if (goldActors.length <= 1) return;
    const t = setInterval(() => setGoldIndex(p => (p + 1) % goldActors.length), 10000);
    return () => clearInterval(t);
  }, [goldActors.length]);

  const currentGoldActor = goldActors[goldIndex] || null;
  const hasGoldActors    = goldActors.length > 0;

  const [mounted,       setMounted]       = useState(false);
  const [activeCard,    setActiveCard]    = useState(null);
  const [heartIndex,    setHeartIndex]    = useState(0);
  const [profileActive, setProfileActive] = useState(null);
  const [clickedBtn,    setClickedBtn]    = useState(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (heartFilmsList.length <= 1) return;
    const t = setInterval(() => setHeartIndex(p => (p + 1) % heartFilmsList.length), 10000);
    return () => clearInterval(t);
  }, [heartFilmsList.length]);

  useEffect(() => { setActiveCard(null); }, [lastFilm?.title]);

  const heartFilm    = heartFilmsList[heartIndex] || null;
  const sec          = SECTION_COLORS[lastFilm?.section]  || SECTION_COLORS.moyen;
  const heartSec     = SECTION_COLORS[heartFilm?.section] || SECTION_COLORS.moyen;
  const detailFilm   = activeCard === 'last' ? lastFilm : activeCard === 'heart' ? heartFilm : null;
  const contextTitle = activeCard === 'last'
    ? { label: 'DERNIER FILM', accent: 'VU' }
    : activeCard === 'heart'
    ? { label: 'COUP DE',      accent: 'CŒUR' }
    : null;

  const handleBtnClick = (key, action) => {
    setClickedBtn(key);
    setTimeout(() => { setClickedBtn(null); action(); }, 500);
  };

  const IconicBadge = () => isLight ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded border ml-3 align-middle"
      style={{ borderColor: 'rgba(201,150,12,0.4)', color: 'var(--accent-color)', backgroundColor: 'rgba(201,150,12,0.07)' }}>
      <Crown size={7} /> Iconic
    </span>
  ) : null;

  if (loading) return (
    <div className="flex-1 w-full flex flex-col items-center justify-center min-h-[60vh]" style={{ backgroundColor: 'var(--bg-color)' }}>
      <Loader2 size={36} className="animate-spin mb-4" style={{ color: 'var(--accent-color)' }} />
      <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
        Chargement de tes archives…
      </p>
    </div>
  );

  // ─── GOLD ACTOR CARD ──────────────────────────────────────────────────────
  const renderGoldActorCard = (compact = false) => {
    if (!hasGoldActors || !currentGoldActor) return null;
    const imgSrc = currentGoldActor.actorImg
      ? `${TMDB_IMG_SM}${currentGoldActor.actorImg}`
      : '';

      return (
        <div
          onClick={() => onGoToFilmsByActor?.(currentGoldActor.actorName)}
          className={`group relative rounded-2xl border overflow-hidden cursor-pointer select-none transition-all duration-300 ${isLight ? 'iconic-card-shimmer' : ''}`}
          style={{
            backgroundColor: 'var(--card-color)',
            borderColor: profileActive === 'gold' ? 'rgba(201,150,12,0.5)' : 'var(--border-subtle)',
            transform:  profileActive === 'gold' ? 'translateY(-4px)' : 'translateY(0)',
            boxShadow:  profileActive === 'gold' ? '0 12px 32px rgba(201,150,12,0.15)' : 'none',
          }}
          onMouseEnter={() => setProfileActive('gold')}
          onMouseLeave={() => setProfileActive(null)}
        >
          {/* Fond radial gold au hover */}
          <div
            className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 70% 50%, rgba(201,150,12,0.1), transparent 70%)',
              opacity: profileActive === 'gold' ? 1 : 0,
            }}
          />
  
          {/* Pagination dots placés tout à fait à droite */}
          {goldActors.length > 1 && (
            <div className="absolute top-4 right-3 flex gap-1 z-10">
              {goldActors.map((_, i) => (
                <div key={i}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: i === goldIndex ? '14px' : '4px',
                    backgroundColor: i === goldIndex ? '#C9960C' : 'rgba(201,150,12,0.25)',
                  }}
                />
              ))}
            </div>
          )}
  
          {/* Contenu - Même padding exact que Acteur Récurrent (px-2 py-4) */}
          <div className="relative z-10 px-2 py-4">
            
            {/* En-tête : "Acteur Gold" placé exactement au même endroit */}
            <div className="flex items-center gap-1 mb-1">
              <Sparkles size={14} style={{ color: '#C9960C' }} />
              <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#C9960C' }}>
                Acteur Gold
              </span>
            </div>
  
            {/* Ligne avec l'avatar et les infos alignés horizontalement */}
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div
                  className="w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-500"
                  style={{
                    borderColor: '#C9960C',
                    boxShadow: profileActive === 'gold'
                      ? '0 0 16px rgba(201,150,12,0.5)'
                      : '0 0 8px rgba(201,150,12,0.3)',
                  }}
                >
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={currentGoldActor.actorName}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-lg font-black"
                      style={{ backgroundColor: 'rgba(201,150,12,0.15)', color: '#C9960C' }}
                    >
                      {currentGoldActor.actorName.charAt(0)}
                    </div>
                  )}
                </div>
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center border"
                  style={{ backgroundColor: '#C9960C', borderColor: 'var(--bg-color)' }}
                >
                  <Heart size={8} fill="white" style={{ color: 'white' }} />
                </div>
              </div>
  
              {/* Infos (Nom + Action) */}
              <div className="min-w-0 flex-1">
                <p
                  className="text-lg font-black tracking-tighter leading-tight break-words mb-1 transition-colors duration-300"
                  style={{ color: profileActive === 'gold' ? '#C9960C' : 'var(--text-primary)' }}
                >
                  {currentGoldActor.actorName}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  Voir ses films
                  <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform duration-300" style={{ color: '#C9960C' }} />
                </p>
              </div>
            </div>
  
          </div>
        </div>
      );
  };

  return (
    <div className="flex-1 w-full relative min-h-screen" style={ts.bgMain}>

      {/* Fond décoratif */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Popcorn className="absolute top-[8%] right-[3%] rotate-12"
          style={{ color: 'var(--accent-color)', width: 200, height: 200, opacity: isLight ? 0.06 : 0.04 }} strokeWidth={1} />
        <Film className="absolute bottom-[12%] left-[2%] -rotate-12"
          style={{ color: isLight ? 'var(--text-muted)' : 'white', width: 220, height: 220, opacity: isLight ? 0.04 : 0.03 }} strokeWidth={1} />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-0">

        {/* ═══════════════════ DESKTOP ═══════════════════ */}
        <section className="hidden lg:flex min-h-[calc(100vh-80px)] flex-col relative z-20">
          <div className="flex-1 flex items-center justify-center gap-16 w-full py-8">

            {/* GAUCHE */}
            <div className={`flex-1 text-center lg:text-left max-w-xl transform transition-all duration-1000 ease-out ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>

              <h1 className="flex flex-wrap items-baseline gap-0 font-black text-5xl xl:text-6xl tracking-tighter mb-3" style={ts.textPrimary}>
                RAVI DE TE REVOIR,
                <span className="text-8xl xl:text-9xl inline-block shadow-2xl tracking-tighter py-2 break-all max-w-full font-logo font-black"
                  style={{ color: 'var(--text-inverse)', backgroundColor: 'var(--accent-color)' }}>
                  {userName}
                </span>
                <span className="text-7xl xl:text-8xl inline-block font-elegant shadow-2xl leading-[0.8] tracking-tighter" style={ts.textAccent}>.</span>
                <IconicBadge />
              </h1>

              <p className="text-lg font-medium leading-relaxed max-w-xl mb-5" style={ts.textSecondary}>
                Merci d'avoir choisi SeenIt pour archiver ta passion du cinéma.<br />
                Tu as déjà archivé{' '}
                <span className="font-bold" style={ts.textPrimary}>{totalFilms} film{totalFilms > 1 ? 's' : ''}</span>
                {topCount > 0 && (
                  <> dont{' '}
                    <span className="font-bold" style={ts.textAccent}>
                      {topCount} chef{topCount > 1 ? 's' : ''}-d'œuvre ou Élite
                    </span>
                  </>
                )}.{' '}
                Prêt pour la prochaine pépite ?
              </p>

              {/* Profil cinéphile desktop */}
              <div>
                <h2 className="text-xl font-black tracking-tighter uppercase mb-4 flex items-center gap-3" style={ts.textPrimary}>
                  Ton profil{' '}
                  <span className="text-md py-1 px-1 font-logo" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }}>
                    cinéphile
                  </span>
                </h2>

                {/* ─── 3 cartes profil ─────────────────────────────────────────
                    Sans gold  → 2 colonnes
                    Avec gold  → 3 colonnes, hauteur fixe identique pour les 3
                ──────────────────────────────────────────────────────────────── */}
                <div className={`grid gap-3 ${hasGoldActors ? 'grid-cols-3' : 'grid-cols-2'}`}
                     style={{ gridAutoRows: '1fr' }}>

                  {/* ── Card Genre dominant ── */}
                  <div
                    className={`group relative rounded-2xl border overflow-hidden cursor-default transition-all duration-300 ${isLight ? 'iconic-card-shimmer' : ''}`}
                    style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent-color) 40%, transparent)';
                      e.currentTarget.style.transform   = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow   = '0 12px 32px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.transform   = 'translateY(0)';
                      e.currentTarget.style.boxShadow   = 'none';
                    }}
                  >
                    {/* Hover bg */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: 'radial-gradient(ellipse at 30% 50%, color-mix(in srgb, var(--accent-color) 8%, transparent), transparent 70%)' }} />
                    {/* Bande pellicule droite */}
                    <div className="absolute right-0 top-0 bottom-0 w-3 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
                      style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 10px, var(--accent-color) 10px, var(--accent-color) 20px)' }} />

                    <div className="relative z-10 px-6 py-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Trophy size={14} className="transition-transform duration-300 group-hover:scale-110" style={ts.textAccent} />
                        <span className="text-[9px] font-black uppercase tracking-widest" style={ts.textMuted}>Genre dominant</span>
                      </div>
                      {totalFilms === 0
                        ? <p className="text-lg font-black leading-none mb-1.5" style={ts.textMuted}>Pas encore</p>
                        : <p className="text-4xl font-black tracking-tighter leading-none mb-1.5 transition-colors duration-300 group-hover:text-[color:var(--accent-color)]"
                             style={ts.textPrimary}>{favoriteGenre}</p>
                      }
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={ts.textMuted}>
                        Sur {totalFilms} film{totalFilms > 1 ? 's' : ''} archivé{totalFilms > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* ── Card Acteur récurrent ── */}
                  <div
                    className={`group relative rounded-2xl border overflow-hidden cursor-default transition-all duration-300 ${isLight ? 'iconic-card-shimmer' : ''}`}
                    style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent-color) 40%, transparent)';
                      e.currentTarget.style.transform   = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow   = '0 12px 32px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.transform   = 'translateY(0)';
                      e.currentTarget.style.boxShadow   = 'none';
                    }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: 'radial-gradient(ellipse at 70% 50%, color-mix(in srgb, var(--accent-color) 8%, transparent), transparent 70%)' }} />

                    <div className="relative z-10 px-2 py-4">
                      <div className="flex items-left gap-1 mb-1">
                        <Mic2 size={14} className="transition-transform duration-300 group-hover:scale-110" style={ts.textAccent} />
                        <span className="text-[9px] font-black uppercase tracking-widest" style={ts.textMuted}>Acteur récurrent</span>
                      </div>

                      {favoriteActorEntry ? (
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="relative shrink-0">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 transition-colors duration-300"
                                 style={{ borderColor: 'var(--border-medium)' }}>
                              {favoriteActorImg
                                ? <img src={favoriteActorImg} alt={favoriteActor}
                                       className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110" />
                                : <div className="w-full h-full flex items-center justify-center text-lg font-black"
                                       style={{ backgroundColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
                                    {favoriteActor.charAt(0)}
                                  </div>
                              }
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center border"
                                 style={{ backgroundColor: 'var(--accent-color)', borderColor: 'var(--bg-color)' }}>
                              <Mic2 size={8} style={{ color: 'var(--text-inverse)' }} />
                            </div>
                          </div>
                          {/* Nom + compte */}
                          <div className="min-w-0 flex-1">
                            <p className="text-lg font-black tracking-tighter leading-tight break-words mb-1 transition-colors duration-300 group-hover:text-[color:var(--accent-color)]"
                               style={ts.textPrimary}>
                              {favoriteActor}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest" style={ts.textMuted}>
                              {favoriteActorEntry.count} film{favoriteActorEntry.count > 1 ? 's' : ''} archivé{favoriteActorEntry.count > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-lg font-black tracking-tight" style={ts.textMuted}>
                          Archive des films pour le découvrir
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ── Card Gold ── */}
                  {hasGoldActors && renderGoldActorCard(false)}

                </div>
              </div>
            </div>

            {/* DROITE : Tickets */}
            <div className={`flex-1 relative h-[480px] flex justify-center items-center transform transition-all duration-1000 delay-300 ease-out ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
              {lastFilm ? (
                <>
                  <div
                    className={`absolute left-4 xl:left-10 w-60 h-[400px] border shadow-2xl flex flex-col items-center justify-center p-7 text-center -rotate-6 z-10 hover:rotate-0 hover:z-30 hover:scale-105 transition-all duration-300 cursor-pointer ${isLight ? 'iconic-card-shimmer' : ''}`}
                    style={{
                      backgroundColor: 'var(--card-color)',
                      borderColor: 'var(--border-subtle)',
                      clipPath: 'polygon(0 40px, 4px 34px, 1px 28px, 7px 20px, 3px 12px, 12px 6px, 20px 0, 100% 0, 100% 100%, 0 100%)',
                    }}
                    onClick={() => onGoToFilms('tous')}>
                    <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full" style={ts.bgMain} />
                    <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full" style={ts.bgMain} />
                    <div className="absolute left-3 right-3 top-1/2 border-t-2 border-dashed" style={{ borderColor: 'var(--border-subtle)' }} />
                    <div className="absolute bottom-4 right-4 flex items-center justify-center rotate-[-15deg]" style={{ color: 'var(--accent-color)', opacity: 0.3 }}>
                      <Stamp size={48} strokeWidth={1.5} />
                      <span className="absolute text-[10px] font-black uppercase tracking-widest mt-1">Admit</span>
                    </div>
                    <div className="relative z-10">
                      <div className="flex justify-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={15} fill={i < lastFilm.rating ? 'currentColor' : 'none'}
                            style={{ color: i < lastFilm.rating ? 'var(--accent-color)' : 'var(--border-medium)' }} />
                        ))}
                      </div>
                      <h3 className="text-xl font-black tracking-tighter uppercase mb-1" style={ts.textPrimary}>{lastFilm.title}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={ts.textAccent}>Vu {lastFilm.watchedAt}</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest mb-4" style={ts.textMuted}>Sorti en {lastFilm.year}</p>
                      {lastFilm.comment && (
                        <p className="text-sm font-black tracking-tighter leading-snug p-3 rounded-lg"
                          style={{ ...ts.textPrimary, backgroundColor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)' }}>
                          <span style={{ color: 'var(--accent-color)', fontSize: '1.5rem' }}>"</span>
                          {lastFilm.comment.length > 80 ? lastFilm.comment.slice(0, 80) + '…' : lastFilm.comment}
                          <span style={{ color: 'var(--accent-color)', fontSize: '1.5rem' }}>"</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div
                    className="absolute right-4 xl:right-10 w-60 h-[400px] shadow-2xl overflow-hidden border rotate-6 z-20 hover:rotate-0 hover:z-30 hover:scale-105 transition-all duration-300 cursor-pointer group"
                    style={{ borderColor: 'var(--border-subtle)' }}
                    onClick={() => onGoToFilms('tous')}>
                    {lastFilm.posterUrl
                      ? <img src={lastFilm.posterUrl} alt={lastFilm.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      : <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'var(--border-subtle)' }}><Film size={60} style={ts.textMuted} strokeWidth={1} /></div>
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={13} fill={i < lastFilm.rating ? 'currentColor' : 'none'}
                              style={{ color: i < lastFilm.rating ? 'var(--accent-color)' : 'rgba(255,255,255,0.3)' }} />
                          ))}
                        </div>
                        <h3 className="font-black text-white text-xl uppercase tracking-tight">{lastFilm.title}</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: 'var(--accent-color)' }}>Vu {lastFilm.watchedAt}</p>
                      </div>
                    </div>
                    <div className={`absolute top-4 left-4 px-2.5 py-1 text-[9px] font-black tracking-[0.15em] uppercase rounded border backdrop-blur-md ${sec.cls}`}>
                      {sec.label}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center w-72 h-[400px] border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 hover:border-[var(--accent-color)] group"
                  style={{ borderColor: 'var(--border-medium)' }}
                  onClick={onGoToSearch}>
                  <Clapperboard size={48} className="mb-4 transition-transform duration-300 group-hover:scale-110" style={{ color: 'var(--border-medium)' }} strokeWidth={1} />
                  <p className="text-sm font-black uppercase tracking-wider text-center px-6" style={ts.textMuted}>Archive ton premier film</p>
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest" style={ts.textAccent}>
                    <Plus size={12} strokeWidth={2.5} /> Commencer
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BANDE BAS DESKTOP */}
          <div className="grid grid-cols-[auto_1fr] gap-5 pb-10 items-stretch">
            <div
              className={`relative w-72 xl:w-96 rounded-2xl overflow-hidden border cursor-pointer group transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:scale-[0.99] ${isLight ? 'iconic-card-shimmer' : ''}`}
              style={{ borderColor: 'color-mix(in srgb, var(--accent-color) 30%, transparent)', background: 'color-mix(in srgb, var(--accent-color) 8%, var(--card-color))' }}
              onClick={onGoToSearch}>
              <div className="absolute left-0 top-0 bottom-0 w-3.5 opacity-25 group-hover:opacity-40 transition-opacity"
                style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 12px, var(--accent-color) 12px, var(--accent-color) 24px)' }} />
              <div className="absolute right-0 top-0 bottom-0 w-3.5 opacity-25 group-hover:opacity-40 transition-opacity"
                style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 12px, var(--accent-color) 12px, var(--accent-color) 24px)' }} />
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full" style={ts.bgMain} />
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full" style={ts.bgMain} />
              <div className="absolute left-4 right-4 top-1/2 border-t border-dashed" style={{ borderColor: 'var(--border-subtle)' }} />
              <Clapperboard className="absolute right-5 top-1/2 -translate-y-1/2 opacity-[0.06] group-hover:opacity-[0.1] group-hover:rotate-6 transition-all duration-500"
                style={{ color: 'var(--accent-color)', width: 100, height: 100 }} strokeWidth={1} />
              <div className="absolute bottom-3 right-5 flex items-center justify-center opacity-30 group-hover:opacity-50 rotate-[-12deg] transition-opacity" style={{ color: 'var(--accent-color)' }}>
                <Stamp size={36} strokeWidth={1.5} />
                <span className="absolute text-[8px] font-black uppercase tracking-widest mt-0.5">Now</span>
              </div>
              <div className="relative z-10 px-10 py-10 flex flex-col justify-center h-full">
                <h3 className="text-3xl font-black tracking-tighter uppercase leading-[0.9] mb-3" style={ts.textPrimary}>
                  T'as regardé<br />un film ?<br />
                  <span style={ts.textAccent}>Prouve-le.</span>
                </h3>
                <p className="text-md text-center font-medium leading-relaxed mb-5" style={ts.textSecondary}>
                  Note-le, juge-le, archive-le.<br />Avant que tu l'oublies demain matin.
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all group-hover:scale-105"
                    style={{ borderColor: 'var(--accent-color)', backgroundColor: 'color-mix(in srgb, var(--accent-color) 15%, transparent)' }}>
                    <Plus size={22} style={{ color: 'var(--accent-color)' }} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest transition-colors group-hover:text-[var(--text-primary)]" style={ts.textMuted}>Ajouter un film</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {[
                {
                  icon: Star, label: 'Mes Favoris',
                  sub:  favCount > 0 ? `${favCount} film${favCount > 1 ? 's' : ''} marqué${favCount > 1 ? 's' : ''} en favori` : 'Marque des films avec ★ pour les retrouver ici',
                  tag: 'FAVS', action: () => onGoToFilms('favorite'),
                },
                {
                  icon: Heart, label: 'Coups de Cœur',
                  sub:  heartCount > 0 ? `${heartCount} film${heartCount > 1 ? 's' : ''} qui t'ont marqué` : 'Marque des films en coup de cœur',
                  tag: '❤️', action: () => onGoToFilms('heart'),
                },
                {
                  icon: Ticket, label: 'Suggestions de la semaine',
                  sub:  'Partage tes films de la semaine avec la communauté',
                  tag: 'HEBDO', action: () => onGoToSuggestions?.(),
                },
              ].map(({ icon: Icon, label, sub, tag, action }) => (
                <button key={label} onClick={action}
                  className={`flex-1 flex items-center gap-5 px-6 py-0 rounded-2xl border transition-all duration-300 group text-left active:scale-[0.985] overflow-hidden relative ${isLight ? 'iconic-card-shimmer' : ''}`}
                  style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent-color) 40%, transparent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, color-mix(in srgb, var(--accent-color) 6%, transparent) 0%, transparent 60%)' }} />
                  <div className="relative z-10 w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--accent-color) 12%, transparent)' }}>
                    <Icon size={22} style={{ color: 'var(--accent-color)' }} />
                  </div>
                  <div className="relative z-10 flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-black text-2xl tracking-tighter uppercase" style={ts.textPrimary}>{label}</span>
                      <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border opacity-40 group-hover:opacity-70 transition-opacity"
                        style={{ color: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}>
                        {tag}
                      </span>
                    </div>
                    <div className="text-xs font-medium truncate transition-colors" style={ts.textMuted}>{sub}</div>
                  </div>
                  <ArrowRight size={18} className="relative z-10 transition-all group-hover:text-[var(--accent-color)] group-hover:translate-x-1 shrink-0" style={ts.textMuted} />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ MOBILE + TABLETTE ═══════════════════ */}
        <div className="lg:hidden">

          {/* 1. Salutation */}
          <div className={`mb-8 pt-4 text-center transform transition-all duration-700 ease-out ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
            <h1 className="text-center font-black tracking-tighter leading-[0.95] text-5xl sm:text-6xl mb-4" style={ts.textPrimary}>
              RAVI DE TE REVOIR,<br />
              <span className="text-6xl sm:text-7xl inline-block py-2 my-1 shadow-2xl font-logo break-all max-w-full"
                style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }}>
                {userName}
              </span>
              <span style={ts.textAccent}>.</span>
              {isLight && (
                <span className="block mt-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded border"
                    style={{ borderColor: 'rgba(201,150,12,0.4)', color: 'var(--accent-color)', backgroundColor: 'rgba(201,150,12,0.07)' }}>
                    <Crown size={8} /> Iconic
                  </span>
                </span>
              )}
            </h1>
            <p className="text-md font-medium mt-4 tracking-wide text-center" style={ts.textSecondary}>
              Merci d'avoir choisi SeenIt. Tu as déjà archivé{' '}
              <span className="font-bold" style={ts.textPrimary}>{totalFilms}</span> film{totalFilms > 1 ? 's' : ''}
              {topCount > 0 && <> · <span className="font-bold" style={ts.textAccent}>{topCount} top</span></>}
            </p>
          </div>

          <div className="h-px w-full mb-8" style={{ backgroundColor: 'var(--border-subtle)' }} />

          {/* 2. Cartes films */}
          <div className="mb-10">
            <div className="overflow-hidden transition-all duration-500 ease-out"
              style={{ maxHeight: contextTitle ? '60px' : '0px', opacity: contextTitle ? 1 : 0, marginBottom: contextTitle ? '16px' : '0px' }}>
              {contextTitle && (
                <h3 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase leading-none mb-2" style={ts.textPrimary}>
                  {contextTitle.label}{' '}
                  <span className="inline-block px-1 shadow-xl" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }}>
                    {contextTitle.accent}
                  </span>
                </h3>
              )}
            </div>

            {totalFilms === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 active:scale-95"
                style={{ borderColor: 'var(--border-medium)' }} onClick={onGoToSearch}>
                <Clapperboard size={36} className="mb-3" style={{ color: 'var(--border-medium)' }} strokeWidth={1} />
                <p className="text-xs font-black uppercase tracking-wider text-center px-6 mb-3" style={ts.textMuted}>Aucun film archivé pour l'instant</p>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest"
                  style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }}>
                  <Plus size={12} /> Ajouter mon premier film
                </div>
              </div>
            ) : (
              <>
                <div className="relative flex justify-center items-center w-full h-[360px] sm:h-[400px]">
                  {lastFilm && (
                    <div onClick={() => setActiveCard(p => p === 'last' ? null : 'last')}
                      className="absolute w-60 h-[340px] sm:w-64 sm:h-[380px] shadow-2xl overflow-hidden cursor-pointer select-none border-2 transition-all duration-400 origin-bottom"
                      style={{
                        borderColor: activeCard === 'last' ? 'color-mix(in srgb, var(--accent-color) 60%, transparent)' : 'var(--border-subtle)',
                        transform: activeCard === 'last' ? 'rotate(0deg) scale(1.05) translateY(-10px)' : 'rotate(-6deg) translateX(-20px)',
                        zIndex: activeCard === 'last' ? 30 : 10,
                      }}>
                      {lastFilm.posterUrl
                        ? <img src={lastFilm.posterUrl} alt={lastFilm.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500" style={{ transform: activeCard === 'last' ? 'scale(1.06)' : 'scale(1)' }} />
                        : <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'var(--border-subtle)' }}><Film size={50} style={ts.textMuted} strokeWidth={1} /></div>
                      }
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className={`absolute top-3 left-3 px-2 py-0.5 text-[8px] font-black tracking-[0.15em] uppercase rounded border backdrop-blur-md ${sec.cls}`}>{sec.label}</div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                        <p className="text-[9px] font-black uppercase tracking-widest mb-0.5 text-white/50">Vu {lastFilm.watchedAt}</p>
                        <p className="text-sm font-black text-white uppercase tracking-tight leading-tight">{lastFilm.title}</p>
                      </div>
                    </div>
                  )}
                  {heartFilm ? (
                    <div onClick={() => setActiveCard(p => p === 'heart' ? null : 'heart')}
                      className="absolute w-60 h-[340px] sm:w-64 sm:h-[380px] shadow-2xl overflow-hidden cursor-pointer select-none border-2 transition-all duration-400 origin-bottom"
                      style={{
                        borderColor: activeCard === 'heart' ? 'color-mix(in srgb, var(--accent-color) 60%, transparent)' : 'var(--border-subtle)',
                        transform: activeCard === 'heart' ? 'rotate(0deg) scale(1.05) translateY(-10px)' : 'rotate(6deg) translateX(20px)',
                        zIndex: activeCard === 'heart' ? 30 : 20,
                      }}>
                      {heartFilm.posterUrl
                        ? <img key={heartFilm.posterUrl} src={heartFilm.posterUrl} alt={heartFilm.title} className="absolute inset-0 w-full h-full object-cover transition-all duration-700" style={{ transform: activeCard === 'heart' ? 'scale(1.06)' : 'scale(1)' }} />
                        : <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'var(--border-subtle)' }}><Film size={50} style={ts.textMuted} strokeWidth={1} /></div>
                      }
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md"
                        style={{ backgroundColor: 'color-mix(in srgb, var(--accent-color) 25%, rgba(0,0,0,0.6))' }}>
                        <Heart size={13} fill="currentColor" style={{ color: 'var(--accent-color)' }} />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                        <p className="text-[9px] font-black uppercase tracking-widest mb-0.5 text-white/50">Coup de cœur</p>
                        <p className="text-sm font-black text-white uppercase tracking-tight leading-tight">{heartFilm.title}</p>
                      </div>
                      {heartFilmsList.length > 1 && (
                        <div className="absolute top-3 left-3 flex gap-1">
                          {heartFilmsList.map((_, i) => (
                            <div key={i} className="h-1 rounded-full transition-all duration-300"
                              style={{ width: i === heartIndex ? '16px' : '4px', backgroundColor: i === heartIndex ? 'var(--accent-color)' : 'rgba(255,255,255,0.3)' }} />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : lastFilm && (
                    <div className="absolute w-60 h-[340px] sm:w-64 sm:h-[380px] border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer"
                      style={{ borderColor: 'var(--border-medium)', transform: 'rotate(6deg) translateX(20px)', zIndex: 20 }}
                      onClick={onGoToSearch}>
                      <div className="text-center px-4">
                        <Heart size={32} className="mx-auto mb-2" style={{ color: 'var(--border-medium)' }} strokeWidth={1} />
                        <p className="text-[9px] font-black uppercase tracking-widest" style={ts.textMuted}>Marque un film en coup de cœur</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ticket détail mobile */}
                <div className={`relative w-full max-w-md mx-auto h-auto min-h-[260px] border shadow-2xl flex flex-col items-center justify-center p-6 sm:p-8 text-center transition-all duration-500 ease-out mt-0.5 z-10 ${isLight ? 'iconic-card-shimmer' : ''}`}
                  style={{
                    backgroundColor: 'var(--card-color)',
                    clipPath: 'polygon(0 40px, 4px 34px, 1px 28px, 7px 20px, 3px 12px, 12px 6px, 20px 0, 100% 0, 100% 100%, 0 100%)',
                    borderColor: detailFilm ? 'color-mix(in srgb, var(--accent-color) 35%, transparent)' : 'var(--border-subtle)',
                    transform: detailFilm ? 'translateY(0px) scale(1)' : 'translateY(8px) scale(0.98)',
                  }}>
                  <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full" style={ts.bgMain} />
                  <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full" style={ts.bgMain} />
                  <div className="absolute left-3 right-3 top-1/2 border-t-2 border-dashed" style={{ borderColor: 'var(--border-subtle)' }} />
                  <div className="absolute bottom-4 right-4 flex items-center justify-center rotate-[-15deg]" style={{ color: 'var(--accent-color)', opacity: 0.3 }}>
                    <Stamp size={48} strokeWidth={1.5} />
                    <span className="absolute text-[10px] font-black uppercase tracking-widest mt-1">Admit</span>
                  </div>
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                    {detailFilm ? (
                      <div className="w-full">
                        <div className="flex justify-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} fill={i < detailFilm.rating ? 'currentColor' : 'none'}
                              style={{ color: i < detailFilm.rating ? 'var(--accent-color)' : 'var(--border-medium)' }} />
                          ))}
                        </div>
                        <h3 className="text-xl font-black tracking-tighter uppercase mb-1" style={ts.textPrimary}>{detailFilm.title}</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={ts.textAccent}>Vu {detailFilm.watchedAt}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={ts.textMuted}>Sorti en {detailFilm.year}</p>
                        {detailFilm.comment && (
                          <p className="text-sm font-black tracking-tighter leading-snug p-3 rounded-lg"
                            style={{ ...ts.textPrimary, backgroundColor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)' }}>
                            <span style={{ color: 'var(--accent-color)', fontSize: '1.5rem' }}>"</span>
                            {detailFilm.comment.length > 100 ? detailFilm.comment.slice(0, 100) + '…' : detailFilm.comment}
                            <span style={{ color: 'var(--accent-color)', fontSize: '1.5rem' }}>"</span>
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center px-2">
                        <div className="w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center mx-auto mb-3" style={{ borderColor: 'var(--border-medium)' }}>
                          <Hand size={18} style={ts.textMuted} />
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed" style={ts.textMuted}>
                          Appuie sur une<br />carte pour voir<br />les détails
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {totalFilms > 0 && (
              <div className="mt-8 flex justify-center">
                <button onClick={() => onGoToFilms('tous')}
                  className="group flex items-center gap-2 px-6 py-3 rounded-xl border font-black text-xs uppercase tracking-widest transition-all duration-300 active:scale-95"
                  style={{ borderColor: 'color-mix(in srgb, var(--accent-color) 40%, transparent)', color: 'var(--accent-color)', backgroundColor: 'color-mix(in srgb, var(--accent-color) 8%, transparent)' }}>
                  Voir tous mes films
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            )}
          </div>

          {/* 3. Profil cinéphile mobile */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase mb-6" style={ts.textPrimary}>
              Ton profil{' '}
              <span className="inline-block px-2 font-logo shadow-xl" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }}>cinéphile</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Genre mobile */}
              <div onClick={() => setProfileActive(p => p === 'genre' ? null : 'genre')}
                className={`relative rounded-2xl border p-6 overflow-hidden cursor-pointer select-none transition-all duration-500 ${isLight ? 'iconic-card-shimmer' : ''}`}
                style={{
                  backgroundColor: 'var(--card-color)',
                  borderColor: profileActive === 'genre' ? 'color-mix(in srgb, var(--accent-color) 40%, transparent)' : 'var(--border-subtle)',
                  transform: profileActive === 'genre' ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: profileActive === 'genre' ? '0 12px 32px rgba(0,0,0,0.12)' : 'none',
                }}>
                <div className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 30% 50%, color-mix(in srgb, var(--accent-color) 10%, transparent), transparent 70%)', opacity: profileActive === 'genre' ? 1 : 0 }} />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy size={14} style={{ color: 'var(--accent-color)', transform: profileActive === 'genre' ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.3s' }} />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={ts.textMuted}>Genre dominant</span>
                  </div>
                  <p className="text-4xl font-black tracking-tighter leading-none mb-2 transition-colors duration-300"
                    style={{ color: profileActive === 'genre' ? 'var(--accent-color)' : totalFilms === 0 ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                    {totalFilms === 0 ? '—' : favoriteGenre}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={ts.textMuted}>
                    Sur {totalFilms} film{totalFilms > 1 ? 's' : ''} archivé{totalFilms > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Acteur récurrent mobile */}
              <div onClick={() => setProfileActive(p => p === 'actor' ? null : 'actor')}
                className={`relative rounded-2xl border p-6 overflow-hidden cursor-pointer select-none transition-all duration-500 ${isLight ? 'iconic-card-shimmer' : ''}`}
                style={{
                  backgroundColor: 'var(--card-color)',
                  borderColor: profileActive === 'actor' ? 'color-mix(in srgb, var(--accent-color) 40%, transparent)' : 'var(--border-subtle)',
                  transform: profileActive === 'actor' ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: profileActive === 'actor' ? '0 12px 32px rgba(0,0,0,0.12)' : 'none',
                }}>
                <div className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 70% 50%, color-mix(in srgb, var(--accent-color) 10%, transparent), transparent 70%)', opacity: profileActive === 'actor' ? 1 : 0 }} />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Mic2 size={14} style={{ color: 'var(--accent-color)', transform: profileActive === 'actor' ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.3s' }} />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={ts.textMuted}>Acteur récurrent</span>
                  </div>
                  {favoriteActorEntry ? (
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-500"
                          style={{ borderColor: profileActive === 'actor' ? 'color-mix(in srgb, var(--accent-color) 60%, transparent)' : 'var(--border-medium)' }}>
                          {favoriteActorImg
                            ? <img src={favoriteActorImg} alt={favoriteActor}
                                   className="w-full h-full object-cover object-top transition-transform duration-500"
                                   style={{ transform: profileActive === 'actor' ? 'scale(1.1)' : 'scale(1)' }} />
                            : <div className="w-full h-full flex items-center justify-center text-xl font-black"
                                   style={{ backgroundColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>{favoriteActor.charAt(0)}</div>
                          }
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2"
                          style={{ backgroundColor: 'var(--accent-color)', borderColor: 'var(--bg-color)' }}>
                          <Mic2 size={9} style={{ color: 'var(--text-inverse)' }} />
                        </div>
                      </div>
                      <div>
                        <p className="text-xl font-black tracking-tighter leading-none mb-1 transition-colors duration-300"
                          style={{ color: profileActive === 'actor' ? 'var(--accent-color)' : 'var(--text-primary)' }}>
                          {favoriteActor}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={ts.textMuted}>
                          {favoriteActorEntry.count} apparition{favoriteActorEntry.count > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm font-black tracking-tight" style={ts.textMuted}>Archive des films pour découvrir ton acteur favori</p>
                  )}
                </div>
              </div>

              {/* Gold Actor mobile */}
              {hasGoldActors && goldLoaded && (
                <div className="sm:col-span-2">
                  <div
                    onClick={() => onGoToFilmsByActor?.(currentGoldActor?.actorName)}
                    onPointerDown={() => setProfileActive('gold')}
                    onPointerUp={() => setProfileActive(null)}
                    onPointerLeave={() => setProfileActive(null)}
                    className={`group relative rounded-2xl border p-6 overflow-hidden cursor-pointer select-none transition-all duration-500 ${isLight ? 'iconic-card-shimmer' : ''}`}
                    style={{
                      backgroundColor: 'var(--card-color)',
                      borderColor: profileActive === 'gold' ? 'rgba(201,150,12,0.5)' : 'var(--border-subtle)',
                      transform: profileActive === 'gold' ? 'translateY(-4px)' : 'translateY(0)',
                      boxShadow: profileActive === 'gold' ? '0 12px 32px rgba(201,150,12,0.15)' : 'none',
                    }}
                  >
                    <div className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
                      style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(201,150,12,0.08), transparent 70%)', opacity: profileActive === 'gold' ? 1 : 0 }} />

                    {goldActors.length > 1 && (
                      <div className="absolute top-3 right-3 flex gap-1 z-10">
                        {goldActors.map((_, i) => (
                          <div key={i} className="h-1 rounded-full transition-all duration-300"
                            style={{ width: i === goldIndex ? '14px' : '4px', backgroundColor: i === goldIndex ? '#C9960C' : 'rgba(201,150,12,0.25)' }} />
                        ))}
                      </div>
                    )}

                    <div className="relative z-10 flex items-center gap-4">
                      <div className="relative shrink-0">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-500"
                          style={{
                            borderColor: '#C9960C',
                            boxShadow: profileActive === 'gold' ? '0 0 16px rgba(201,150,12,0.5)' : '0 0 8px rgba(201,150,12,0.3)',
                          }}>
                          {currentGoldActor?.actorImg ? (
                            <img src={`${TMDB_IMG_SM}${currentGoldActor.actorImg}`} alt={currentGoldActor.actorName}
                                 className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl font-black"
                                 style={{ backgroundColor: 'rgba(201,150,12,0.15)', color: '#C9960C' }}>
                              {currentGoldActor?.actorName?.charAt(0) || '?'}
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2"
                          style={{ backgroundColor: '#C9960C', borderColor: 'var(--bg-color)' }}>
                          <Heart size={9} fill="white" style={{ color: 'white' }} />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Sparkles size={9} style={{ color: '#C9960C' }} />
                          <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: '#C9960C' }}>Acteur Gold</span>
                        </div>
                        <p className="text-xl font-black tracking-tighter leading-none mb-1 truncate transition-colors duration-300"
                          style={{ color: profileActive === 'gold' ? '#C9960C' : 'var(--text-primary)' }}>
                          {currentGoldActor?.actorName}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                          Voir ses films
                          <ChevronRight size={10} style={{ color: '#C9960C' }} />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. Ajout + Boutons mobile */}
          <div className="grid grid-cols-1 gap-6 pb-8">
            <div
              className={`relative rounded-2xl overflow-hidden border cursor-pointer group transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:scale-[0.99] ${isLight ? 'iconic-card-shimmer' : ''}`}
              style={{ borderColor: 'color-mix(in srgb, var(--accent-color) 30%, transparent)', background: 'color-mix(in srgb, var(--accent-color) 8%, var(--card-color))' }}
              onClick={onGoToSearch}>
              <div className="absolute left-0 top-0 bottom-0 w-3.5 opacity-25 group-hover:opacity-40 transition-opacity" style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 12px, var(--accent-color) 12px, var(--accent-color) 24px)' }} />
              <div className="absolute right-0 top-0 bottom-0 w-3.5 opacity-25 group-hover:opacity-40 transition-opacity" style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 12px, var(--accent-color) 12px, var(--accent-color) 24px)' }} />
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full" style={ts.bgMain} />
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full" style={ts.bgMain} />
              <div className="absolute left-4 right-4 top-1/2 border-t border-dashed" style={{ borderColor: 'var(--border-subtle)' }} />
              <Clapperboard className="absolute right-5 top-1/2 -translate-y-1/2 opacity-[0.06] group-hover:opacity-[0.1] group-hover:rotate-6 transition-all duration-500"
                style={{ color: 'var(--accent-color)', width: 100, height: 100 }} strokeWidth={1} />
              <div className="relative z-10 px-10 py-10 flex flex-col justify-center h-full">
                <h3 className="text-3xl font-black tracking-tighter uppercase leading-[0.9] mb-3" style={ts.textPrimary}>
                  T'as regardé<br />un film ?<br />
                  <span style={ts.textAccent}>Prouve-le.</span>
                </h3>
                <p className="text-sm font-medium leading-relaxed mb-5" style={ts.textSecondary}>
                  Note-le, juge-le, archive-le.<br />Avant que tu l'oublies demain matin.
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all group-hover:scale-105"
                    style={{ borderColor: 'var(--accent-color)', backgroundColor: 'color-mix(in srgb, var(--accent-color) 15%, transparent)' }}>
                    <Plus size={22} style={{ color: 'var(--accent-color)' }} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest transition-colors" style={ts.textMuted}>Ajouter un film</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {[
                {
                  icon: Star, label: 'Mes', labelAccent: 'Favoris',
                  sub:  favCount > 0 ? `${favCount} film${favCount > 1 ? 's' : ''} en favori` : "Aucun favori pour l'instant",
                  key: 'fav', action: () => onGoToFilms('favorite'),
                },
                {
                  icon: Heart, label: 'Coups de', labelAccent: 'Cœur',
                  sub:  heartCount > 0 ? `${heartCount} film${heartCount > 1 ? 's' : ''} qui t'ont marqué` : "Aucun coup de cœur pour l'instant",
                  key: 'heart', action: () => onGoToFilms('heart'),
                },
                {
                  icon: Ticket, label: 'Suggestions', labelAccent: 'de la semaine',
                  sub: 'Partage tes films de la semaine',
                  key: 'suggestions', action: () => onGoToSuggestions?.(),
                },
              ].map(({ icon: Icon, label, labelAccent, sub, key, action }) => (
                <button key={key} onClick={() => handleBtnClick(key, action)}
                  className={`flex-1 flex items-center gap-5 p-5 rounded-3xl border transition-all text-left active:scale-[0.985] select-none relative overflow-hidden ${isLight ? 'iconic-card-shimmer' : ''}`}
                  style={{
                    backgroundColor: 'var(--card-color)',
                    borderColor: clickedBtn === key ? 'color-mix(in srgb, var(--accent-color) 40%, transparent)' : 'var(--border-subtle)',
                    transform: clickedBtn === key ? 'translateY(-3px)' : 'translateY(0)',
                    transition: 'all 0.5s ease',
                  }}>
                  <div className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                    style={{ background: 'linear-gradient(90deg, color-mix(in srgb, var(--accent-color) 8%, transparent) 0%, transparent 60%)', opacity: clickedBtn === key ? 1 : 0 }} />
                  <div className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--accent-color) 12%, transparent)', transform: clickedBtn === key ? 'scale(1.1)' : 'scale(1)' }}>
                    <Icon size={26} style={{ color: 'var(--accent-color)' }} />
                  </div>
                  <div className="relative z-10 flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5 flex-wrap mb-0.5">
                      <span className="font-black text-xl tracking-tighter uppercase" style={ts.textPrimary}>{label}</span>
                      <span className="font-black text-xl tracking-tighter uppercase" style={ts.textAccent}>{labelAccent}</span>
                    </div>
                    <div className="text-sm font-medium truncate transition-colors duration-500"
                      style={{ color: clickedBtn === key ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                      {sub}
                    </div>
                  </div>
                  <ArrowRight size={20} className="relative z-10 transition-all duration-500 shrink-0"
                    style={{ color: clickedBtn === key ? 'var(--accent-color)' : 'var(--text-muted)', transform: clickedBtn === key ? 'translateX(4px)' : 'translateX(0)' }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
