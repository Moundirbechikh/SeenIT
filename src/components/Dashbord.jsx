import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Clapperboard, Film, Popcorn,
  Star, Heart, Trophy, Mic2, Clock,
  ArrowRight, Zap, Stamp, Camera, Ticket, Hand, ChevronRight
} from 'lucide-react';

// ─── DONNÉES MOCK ───────────────────────────
const LAST_FILM = {
  title: 'Interstellar',
  year: '2014',
  rating: 5,
  section: 'elite',
  posterUrl: 'https://image.tmdb.org/t/p/w500/1pnigkWWy8W032o9TKDneBa3eVK.jpg',
  watchedAt: 'Hier soir',
  comment: "Visuellement fou. J'ai rien compris à la 5ème dimension mais la musique de Hans Zimmer sauve tout.",
};

const COUP_DE_COEUR_FILMS = [
  {
    title: 'Interstellar',
    year: '2014',
    rating: 5,
    section: 'elite',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1pnigkWWy8W032o9TKDneBa3eVK.jpg',
    watchedAt: 'Hier soir',
    comment: "Visuellement fou. J'ai rien compris à la 5ème dimension mais la musique de Hans Zimmer sauve tout.",
  },
  {
    title: 'Matrix',
    year: '1999',
    rating: 5,
    section: 'elite',
    posterUrl: 'https://image.tmdb.org/t/p/w500/pEoqbqtLc4CcwDUDqxmEDSWpWTZ.jpg',
    watchedAt: 'La semaine passée',
    comment: "Pilule rouge direct. Ce film a redéfini ma vision de la réalité.",
  },
];

const USER_STATS = {
  name: 'Bouchra',
  totalFilms: 5,
  favoriteGenre: 'Sci-Fi',
  favoriteActor: 'M. McConaughey',
  favoriteActorImg: 'https://image.tmdb.org/t/p/w200/wJiGedOCZhwMx9DezY8uwbNxmAY.jpg',
  eliteCount: 4,
  heartCount: 2,
};

const SECTION_COLORS = {
  elite: { label: 'Élite', cls: 'bg-purple-600 text-white border-purple-400/40 shadow-[0_0_12px_rgba(147,51,234,0.5)]' },
  moyen: { label: 'Moyen', cls: 'bg-amber-500 text-slate-950 border-amber-300/40' },
  navet: { label: 'Navet', cls: 'bg-rose-600 text-white border-rose-400/40' },
};

export default function Dashboard({ onGoToSearch, onGoToFilms }) {
  const [mounted, setMounted] = useState(false);
  const [activeCard, setActiveCard] = useState(null); // null | 'last' | 'heart'
  const [heartIndex, setHeartIndex] = useState(0);
  const [profileActive, setProfileActive] = useState(null); // null | 'genre' | 'actor'
  const [clickedBtn, setClickedBtn] = useState(null);

  const sec = SECTION_COLORS[LAST_FILM.section] || SECTION_COLORS.moyen;
  const heartFilm = COUP_DE_COEUR_FILMS[heartIndex];
  const heartSec = SECTION_COLORS[heartFilm.section] || SECTION_COLORS.moyen;

  useEffect(() => { setMounted(true); }, []);

  // Rotation automatique coups de cœur toutes les 10s
  useEffect(() => {
    const timer = setInterval(() => {
      setHeartIndex(p => (p + 1) % COUP_DE_COEUR_FILMS.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Données de la card détail selon activeCard
  const detailFilm = activeCard === 'last' ? LAST_FILM : activeCard === 'heart' ? heartFilm : null;
  const detailSec = detailFilm
    ? SECTION_COLORS[detailFilm.section] || SECTION_COLORS.moyen
    : null;

  // Titre contextuel selon activeCard
  const contextTitle = activeCard === 'last'
    ? { label: 'DERNIER FILM', accent: 'VU' }
    : activeCard === 'heart'
    ? { label: 'COUP DE', accent: 'CŒUR' }
    : null;

  const handleBtnClick = (key, action) => {
    setClickedBtn(key);
    setTimeout(() => {
      setClickedBtn(null);
      action();
    }, 500);
  };

  return (
    <div
      className="flex-1 w-full relative min-h-screen"
      style={{ backgroundColor: 'var(--bg-color, #060606)' }}
    >
      {/* Filigranes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Popcorn className="absolute top-[8%] right-[3%] opacity-[0.04] rotate-12"
          style={{ color: 'var(--accent-color)', width: 200, height: 200 }} strokeWidth={1} />
        <Film className="absolute bottom-[12%] left-[2%] opacity-[0.03] -rotate-12"
          style={{ color: 'white', width: 220, height: 220 }} strokeWidth={1} />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-0">

        {/* ====================== HERO DESKTOP ====================== */}
        {/* DESKTOP - INCHANGÉ */}
        <section className="hidden lg:flex min-h-[calc(100vh-80px)] flex-col relative z-20">
          <div className="flex-1 flex items-center justify-center gap-16 w-full py-8">

            {/* ── PARTIE GAUCHE : Texte + Profil ── */}
            <div
              className={`flex-1 text-center lg:text-left max-w-xl transform transition-all duration-1000 ease-out ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}
            >
              <h1 className="flex flex-wrap items-baseline gap-0 font-black text-5xl xl:text-6xl tracking-tighter text-white mb-3">
              RAVI DE TE REVOIR,
                <span
                  className="text-8xl xl:text-9xl inline-block shadow-2xl tracking-tighter py-1"
                  style={{ color: 'var(--bg-color)', backgroundColor: 'var(--accent-color)' }}
                >
                 {USER_STATS.name}
                </span>
                
                <span
                  className="text-8xl xl:text-9xl inline-block shadow-2xl leading-[0.8] tracking-tighter"
                  style={{ color: 'var(--accent-color)' }}
                >
                 . 
                </span>
                
              </h1>

              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl mb-5">
                Merci d'avoir choisi SeenIt pour archiver ta passion du cinéma.<br />
                Tu as déjà archivé <span className="text-white font-bold">{USER_STATS.totalFilms} films</span> dont{' '}
                <span style={{ color: 'var(--accent-color)' }} className="font-bold">{USER_STATS.eliteCount} classés Élite</span>. Prêt pour la prochaine pépite ?
              </p>

              <div>
                <h2 className="text-xl font-black tracking-tighter text-white uppercase mb-4 flex items-center gap-3">
                  Ton profil{' '}
                  <span className="text-md py-1" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--bg-color)' }}>
                    cinéphile
                  </span>
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="group relative rounded-2xl border border-white/10 p-6 bg-[var(--card-color)] overflow-hidden cursor-default transition-all duration-300 hover:border-[var(--accent-color)]/40 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: 'radial-gradient(ellipse at 30% 50%, color-mix(in srgb, var(--accent-color) 8%, transparent), transparent 70%)' }} />
                    <div className="absolute right-0 top-0 bottom-0 w-3 opacity-10 group-hover:opacity-20 transition-opacity"
                      style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 10px, var(--accent-color) 10px, var(--accent-color) 20px)' }} />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <Trophy size={14} className="transition-transform duration-300 group-hover:scale-110" style={{ color: 'var(--accent-color)' }} />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Genre dominant</span>
                      </div>
                      <p className="text-4xl font-black text-white tracking-tighter leading-none mb-1.5 group-hover:text-[var(--accent-color)] transition-colors duration-300">
                        {USER_STATS.favoriteGenre}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sur {USER_STATS.totalFilms} films archivés</p>
                    </div>
                  </div>

                  <div className="group relative rounded-2xl border border-white/10 p-5 bg-[var(--card-color)] overflow-hidden cursor-default transition-all duration-300 hover:border-[var(--accent-color)]/40 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: 'radial-gradient(ellipse at 70% 50%, color-mix(in srgb, var(--accent-color) 8%, transparent), transparent 70%)' }} />
                    <div className="relative z-10 flex items-center gap-4 h-full">
                      <div className="relative shrink-0">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-[var(--accent-color)]/60 transition-colors duration-300">
                          <img src={USER_STATS.favoriteActorImg} alt={USER_STATS.favoriteActor} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center border border-[var(--bg-color)]"
                          style={{ backgroundColor: 'var(--accent-color)' }}>
                          <Mic2 size={8} style={{ color: 'var(--bg-color)' }} />
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Acteur récurrent</span>
                        <p className="text-xl font-black text-white tracking-tighter leading-none mb-1 group-hover:text-[var(--accent-color)] transition-colors duration-300">
                          {USER_STATS.favoriteActor}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dans tes archives</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── PARTIE DROITE : Double Tickets (style Landing) ── */}
            <div
              className={`flex-1 relative h-[480px] flex justify-center items-center transform transition-all duration-1000 delay-300 ease-out ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}
            >
              <div
                className="absolute left-4 xl:left-10 w-60 h-[400px] bg-[var(--card-color)] border border-white/10 shadow-2xl flex flex-col items-center justify-center p-7 text-center -rotate-6 z-10 hover:rotate-0 hover:z-30 hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ clipPath: 'polygon(0 40px, 4px 34px, 1px 28px, 7px 20px, 3px 12px, 12px 6px, 20px 0, 100% 0, 100% 100%, 0 100%)' }}
                onClick={onGoToFilms}
              >
                <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--bg-color)]" />
                <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--bg-color)]" />
                <div className="absolute left-3 right-3 top-1/2 border-t-2 border-dashed border-white/10" />
                <div className="absolute bottom-4 right-4 flex items-center justify-center opacity-40 rotate-[-15deg]" style={{ color: 'var(--accent-color)' }}>
                  <Stamp size={48} strokeWidth={1.5} />
                  <span className="absolute text-[10px] font-black uppercase tracking-widest mt-1">Admit</span>
                </div>
                <div className="relative z-10">
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} fill={i < LAST_FILM.rating ? 'currentColor' : 'none'} className={i < LAST_FILM.rating ? 'text-[var(--accent-color)]' : 'text-white/20'} />
                    ))}
                  </div>
                  <h3 className="text-xl font-black tracking-tighter text-white uppercase mb-1">{LAST_FILM.title}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: 'var(--accent-color)' }}>
                    {LAST_FILM.watchedAt} · {LAST_FILM.year}
                  </p>
                  <p className="text-sm font-black tracking-tighter text-slate-100 leading-snug bg-[var(--card-color)]/50 backdrop-blur-sm p-3 rounded-lg">
                    <span style={{ color: 'var(--accent-color)', fontSize: '1.5rem' }}>"</span>
                    {LAST_FILM.comment}
                    <span style={{ color: 'var(--accent-color)', fontSize: '1.5rem' }}>"</span>
                  </p>
                </div>
              </div>

              <div
                className="absolute right-4 xl:right-10 w-60 h-[400px] shadow-2xl overflow-hidden border-2 border-white/5 rotate-6 z-20 hover:rotate-0 hover:z-30 hover:scale-105 transition-all duration-300 cursor-pointer group"
                onClick={onGoToFilms}
              >
                <img src={LAST_FILM.posterUrl} alt={LAST_FILM.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} fill={i < LAST_FILM.rating ? 'currentColor' : 'none'} className={i < LAST_FILM.rating ? 'text-[var(--accent-color)]' : 'text-white/30'} />
                      ))}
                    </div>
                    <h3 className="font-black text-white text-xl uppercase tracking-tight">{LAST_FILM.title}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent-color)' }}>{LAST_FILM.year}</span>
                  </div>
                </div>
                <div className={`absolute top-4 left-4 px-2.5 py-1 text-[9px] font-black tracking-[0.15em] uppercase rounded border backdrop-blur-md ${sec.cls}`}>
                  {sec.label}
                </div>
              </div>
            </div>
          </div>

          {/* ── BANDE BAS DESKTOP ── */}
          <div className="grid grid-cols-[auto_1fr] gap-5 pb-10 items-stretch">
            <div
              className="relative w-72 xl:w-96 rounded-2xl overflow-hidden border cursor-pointer group transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 active:scale-[0.99]"
              style={{
                borderColor: 'color-mix(in srgb, var(--accent-color) 30%, transparent)',
                background: 'color-mix(in srgb, var(--accent-color) 8%, var(--card-color, #111))',
              }}
              onClick={onGoToSearch}
            >
              <div className="absolute left-0 top-0 bottom-0 w-3.5 opacity-25 group-hover:opacity-40 transition-opacity"
                style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 12px, var(--accent-color) 12px, var(--accent-color) 24px)' }} />
              <div className="absolute right-0 top-0 bottom-0 w-3.5 opacity-25 group-hover:opacity-40 transition-opacity"
                style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 12px, var(--accent-color) 12px, var(--accent-color) 24px)' }} />
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--bg-color)]" />
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--bg-color)]" />
              <div className="absolute left-4 right-4 top-1/2 border-t border-dashed border-white/10" />
              <Clapperboard
                className="absolute right-5 top-1/2 -translate-y-1/2 opacity-[0.06] group-hover:opacity-[0.1] group-hover:rotate-6 transition-all duration-500"
                style={{ color: 'var(--accent-color)', width: 100, height: 100 }}
                strokeWidth={1}
              />
              <div className="absolute bottom-3 right-5 flex items-center justify-center opacity-30 group-hover:opacity-50 rotate-[-12deg] transition-opacity" style={{ color: 'var(--accent-color)' }}>
                <Stamp size={36} strokeWidth={1.5} />
                <span className="absolute text-[8px] font-black uppercase tracking-widest mt-0.5">Now</span>
              </div>
              <div className="relative z-10 px-10 py-10 flex flex-col justify-center h-full">
                <h3 className="text-3xl font-black tracking-tighter text-white uppercase leading-[0.9] mb-3">
                  T'as regardé<br />
                  un film ?<br />
                  <span style={{ color: 'var(--accent-color)' }}>Prouve-le.</span>
                </h3>
                <p className="text-slate-400 text-md text-center font-medium leading-relaxed mb-5">
                  Note-le, juge-le, archive-le.<br />Avant que tu l'oublies demain matin.
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all group-hover:scale-105"
                    style={{ borderColor: 'var(--accent-color)', backgroundColor: 'color-mix(in srgb, var(--accent-color) 15%, transparent)' }}
                  >
                    <Plus size={22} style={{ color: 'var(--accent-color)' }} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">Ajouter un film</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {[
                {
                  icon: Star,
                  label: 'Mes Favoris',
                  sub: `${USER_STATS.eliteCount} films Élite dans tes archives`,
                  tag: 'ÉLITE',
                  action: onGoToFilms,
                },
                {
                  icon: Heart,
                  label: 'Coups de Cœur',
                  sub: `${USER_STATS.heartCount} films qui t'ont marqué`,
                  tag: 'FAVS',
                  action: onGoToFilms,
                },
                {
                  icon: Camera,
                  label: 'Sélection hebdo',
                  sub: 'Tes stats de la semaine en un coup d\'œil',
                  tag: 'STATS',
                  action: () => {},
                },
              ].map(({ icon: Icon, label, sub, tag, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="flex-1 flex items-center gap-5 px-6 py-0 rounded-2xl border border-white/8 hover:border-[var(--accent-color)]/40 transition-all duration-300 group text-left active:scale-[0.985] overflow-hidden relative"
                  style={{ backgroundColor: 'var(--card-color, #111)' }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, color-mix(in srgb, var(--accent-color) 6%, transparent) 0%, transparent 60%)' }} />
                  <div className="relative z-10 w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--accent-color) 12%, transparent)' }}>
                    <Icon size={22} style={{ color: 'var(--accent-color)' }} />
                  </div>
                  <div className="relative z-10 flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-white font-black text-2xl tracking-tighter uppercase">{label}</span>
                      <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border opacity-40 group-hover:opacity-70 transition-opacity"
                        style={{ color: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}>
                        {tag}
                      </span>
                    </div>
                    <div className="text-slate-500 text-xs font-medium truncate group-hover:text-slate-400 transition-colors">{sub}</div>
                  </div>
                  <ArrowRight size={18} className="relative z-10 text-slate-700 group-hover:text-[var(--accent-color)] group-hover:translate-x-1 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ====================== MOBILE + TABLETTE ====================== */}
        <div className="lg:hidden">
          {/* ── 1. SALUTATION STYLE LANDING ── */}
{/* -- 1. SALUTATION STYLE LANDING (Mis à jour style image_8d21c2.jpg) -- */}
<div className={`mb-8 pt-4 text-center transform transition-all duration-700 ease-out ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
            <h1 className="text-center font-black tracking-tighter leading-[0.95] text-5xl sm:text-6xl text-white mb-4">
              RAVI DE TE REVOIR,<br />
              <span className="text-6xl sm:text-7xl inline-block bg-[var(--accent-color)] text-[var(--bg-color)]  py-2 my-1 shadow-2xl">
              {USER_STATS.name}
              </span>
              <span style={{ color: 'var(--accent-color)' }}>
                .
              </span>
            </h1>
            <p className="text-slate-400 text-md font-medium mt-4 tracking-wide text-center">
            Merci d'avoir choisi SeenIt pour archiver ta passion du cinéma.<br />
                Tu as déjà archivé {' '}
              <span className="text-white font-bold">{USER_STATS.totalFilms}</span> films ·{' '}
              <span style={{ color: 'var(--accent-color)' }} className="font-bold">{USER_STATS.eliteCount}</span> classés Élite
            </p>
          </div>

          <div className="h-px w-full bg-white/8 mb-8" />

{/* ── 2. SECTION CARTES FILMS (Design Superposé & Ticket en dessous) ── */}
<div className="mb-10">
  {/* Titre contextuel — apparaît seulement si une carte est active */}
  <div
    className="overflow-hidden transition-all duration-500 ease-out "
    style={{
      maxHeight: contextTitle ? '60px' : '0px',
      opacity: contextTitle ? 1 : 0,
      marginBottom: contextTitle ? '16px' : '0px',
    }}
  >
    {contextTitle && (
      <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-white uppercase leading-none mb-2">
        {contextTitle.label}{' '}
        <span
          className="inline-block px-1 shadow-xl"
          style={{ backgroundColor: 'var(--accent-color)', color: 'var(--bg-color)' }}
        >
          {contextTitle.accent}
        </span>
      </h3>
    )}
  </div>

  {/* ─── ZONE DES 2 CARTES POSTERS SUPERPOSÉES AU CENTRE ─── */}
  <div className="relative flex justify-center items-center w-full h-[360px] sm:h-[400px]">

    {/* ─ CARD A : Dernier film vu (poster) — Gauche / Arrière-plan dynamique ─ */}
    <div
      onClick={() => setActiveCard(p => p === 'last' ? null : 'last')}
      className="absolute w-60 h-[340px] sm:w-64 sm:h-[380px] shadow-2xl overflow-hidden cursor-pointer select-none border-2 transition-all duration-400 origin-bottom"
      style={{
        borderColor: activeCard === 'last'
          ? 'color-mix(in srgb, var(--accent-color) 60%, transparent)'
          : 'rgba(255,255,255,0.06)',
        transform: activeCard === 'last'
          ? 'rotate(0deg) scale(1.05) translateY(-10px)'
          : 'rotate(-6deg) translateX(-20px)',
        zIndex: activeCard === 'last' ? 30 : 10
      }}
    >
      <img
        src={LAST_FILM.posterUrl}
        alt={LAST_FILM.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
        style={{ transform: activeCard === 'last' ? 'scale(1.06)' : 'scale(1)' }}
      />
      {/* Gradient + infos au bas */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      <div className={`absolute top-3 left-3 px-2 py-0.5 text-[8px] font-black tracking-[0.15em] uppercase rounded border backdrop-blur-md ${sec.cls}`}>
        {sec.label}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
        <p className="text-[9px] font-black uppercase tracking-widest mb-0.5 text-white/50">Dernier vu</p>
        <p className="text-sm font-black text-white uppercase tracking-tight leading-tight">{LAST_FILM.title}</p>
      </div>

      {/* Ring actif */}
      {activeCard === 'last' && (
        <div className="absolute inset-0 ring-2 ring-inset pointer-events-none"
          style={{ ringColor: 'var(--accent-color)', boxShadow: `inset 0 0 0 2px color-mix(in srgb, var(--accent-color) 60%, transparent)` }} />
      )}
    </div>

    {/* ─ CARD B : Coup de cœur rotatif (poster) — Droite / Avant-plan dynamique ─ */}
    <div
      onClick={() => setActiveCard(p => p === 'heart' ? null : 'heart')}
      className="absolute w-60 h-[340px] sm:w-64 sm:h-[380px] shadow-2xl overflow-hidden cursor-pointer select-none border-2 transition-all duration-400 origin-bottom"
      style={{
        borderColor: activeCard === 'heart'
          ? 'color-mix(in srgb, var(--accent-color) 60%, transparent)'
          : 'rgba(255,255,255,0.06)',
        transform: activeCard === 'heart'
          ? 'rotate(0deg) scale(1.05) translateY(-10px)'
          : 'rotate(6deg) translateX(20px)',
        zIndex: activeCard === 'heart' ? 30 : 20
      }}
    >
      <img
        key={heartFilm.posterUrl}
        src={heartFilm.posterUrl}
        alt={heartFilm.title}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
        style={{ transform: activeCard === 'heart' ? 'scale(1.06)' : 'scale(1)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      
      {/* Badge cœur */}
      <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md"
        style={{ backgroundColor: 'color-mix(in srgb, var(--accent-color) 25%, rgba(0,0,0,0.6))' }}>
        <Heart size={13} fill="currentColor" style={{ color: 'var(--accent-color)' }} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
        <p className="text-[9px] font-black uppercase tracking-widest mb-0.5 text-white/50">Coup de cœur</p>
        <p className="text-sm font-black text-white uppercase tracking-tight leading-tight">{heartFilm.title}</p>
      </div>

      {/* Indicateurs pagination coups de cœur */}
      <div className="absolute top-3 left-3 flex gap-1">
        {COUP_DE_COEUR_FILMS.map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: i === heartIndex ? '16px' : '4px',
              backgroundColor: i === heartIndex
                ? 'var(--accent-color)'
                : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>

      {/* Ring actif */}
      {activeCard === 'heart' && (
        <div className="absolute inset-0 ring-2 ring-inset pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 2px color-mix(in srgb, var(--accent-color) 60%, transparent)` }} />
      )}
    </div>
  </div>

  {/* ─── 3ÈME CARD : DETAIL (Ticket) — S'affiche en dessous et prend toute la largeur/emplacement comme la capture ─── */}
  <div
    className="relative w-full max-w-md mx-auto h-auto min-h-[320px] bg-[var(--card-color)] border shadow-2xl flex flex-col items-center justify-center p-6 sm:p-8 text-center transition-all duration-500 ease-out mt-0.5 z-10"
    style={{
      clipPath: 'polygon(0 40px, 4px 34px, 1px 28px, 7px 20px, 3px 12px, 12px 6px, 20px 0, 100% 0, 100% 100%, 0 100%)',
      borderColor: detailFilm
        ? `color-mix(in srgb, var(--accent-color) 35%, transparent)`
        : 'rgba(255,255,255,0.07)',
      transform: detailFilm ? 'translateY(0px) scale(1)' : 'translateY(8px) scale(0.98)',
    }}
  >
    {/* Détails ticket gauche/droite */}
    <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--bg-color)]" />
    <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--bg-color)]" />
    <div className="absolute left-3 right-3 top-1/2 border-t-2 border-dashed border-white/10" />
    
    <div className="absolute bottom-4 right-4 flex items-center justify-center opacity-30 rotate-[-15deg]" style={{ color: 'var(--accent-color)' }}>
      <Stamp size={48} strokeWidth={1.5} />
      <span className="absolute text-[10px] font-black uppercase tracking-widest mt-1">Admit</span>
    </div>

    {/* Contenu dynamique : message par défaut ou infos de la carte cliquée */}
    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
      {detailFilm ? (
        <div className="w-full animate-[fadeInUp_0.4s_ease-out]">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill={i < detailFilm.rating ? 'currentColor' : 'none'}
                className={i < detailFilm.rating ? 'text-[var(--accent-color)]' : 'text-white/20'} />
            ))}
          </div>
          <h3 className="text-xl font-black tracking-tighter text-white uppercase mb-1">{detailFilm.title}</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: 'var(--accent-color)' }}>
            {detailFilm.watchedAt} · {detailFilm.year}
          </p>
          <p className="text-sm font-black tracking-tighter text-slate-100 leading-snug bg-[var(--card-color)]/50 backdrop-blur-sm p-3 rounded-lg">
            <span style={{ color: 'var(--accent-color)', fontSize: '1.5rem' }}>"</span>
            {detailFilm.comment}
            <span style={{ color: 'var(--accent-color)', fontSize: '1.5rem' }}>"</span>
          </p>
        </div>
      ) : (
        <div className="text-center px-2">
          <div className="w-10 h-10 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mx-auto mb-3">
            <Hand size={18} className="text-white/30" />
          </div>
          <p className="text-[11px] font-black uppercase tracking-widest text-white/25 leading-relaxed">
            Appuie sur une<br />carte pour voir<br />les détails
          </p>
        </div>
      )}
    </div>
  </div>

  {/* Bouton Voir plus */}
  <div className="mt-8 flex justify-center">
    <button
      onClick={onGoToFilms}
      className="group flex items-center gap-2 px-6 py-3 rounded-xl border font-black text-xs uppercase tracking-widest transition-all duration-300 active:scale-95"
      style={{
        borderColor: 'color-mix(in srgb, var(--accent-color) 40%, transparent)',
        color: 'var(--accent-color)',
        backgroundColor: 'color-mix(in srgb, var(--accent-color) 8%, transparent)',
      }}
    >
      Voir plus
      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
    </button>
  </div>
</div>

          {/* ── 3. PROFIL CINÉPHILE MOBILE ── */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-white uppercase mb-6">
              Ton profil{' '}
              <span
                className="inline-block px-2 shadow-xl"
                style={{ backgroundColor: 'var(--accent-color)', color: 'var(--bg-color)' }}
              >
                cinéphile
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card Genre — click active le hover effect */}
              <div
                onClick={() => setProfileActive(p => p === 'genre' ? null : 'genre')}
                className="relative rounded-2xl border p-6 overflow-hidden cursor-pointer select-none transition-all duration-500"
                style={{
                  backgroundColor: 'var(--card-color)',
                  borderColor: profileActive === 'genre'
                    ? 'color-mix(in srgb, var(--accent-color) 40%, transparent)'
                    : 'rgba(255,255,255,0.08)',
                  transform: profileActive === 'genre' ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: profileActive === 'genre' ? '0 12px 32px rgba(0,0,0,0.4)' : 'none',
                }}
              >
                {/* Glow radial actif */}
                <div
                  className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at 30% 50%, color-mix(in srgb, var(--accent-color) 10%, transparent), transparent 70%)',
                    opacity: profileActive === 'genre' ? 1 : 0,
                  }}
                />
                {/* Film strip droit */}
                <div
                  className="absolute right-0 top-0 bottom-0 w-3 transition-opacity duration-500"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 10px, var(--accent-color) 10px, var(--accent-color) 20px)',
                    opacity: profileActive === 'genre' ? 0.2 : 0.08,
                  }}
                />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy
                      size={14}
                      style={{
                        color: 'var(--accent-color)',
                        transform: profileActive === 'genre' ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.3s',
                      }}
                    />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Genre dominant</span>
                  </div>
                  <p
                    className="text-4xl font-black tracking-tighter leading-none mb-2 transition-colors duration-300"
                    style={{ color: profileActive === 'genre' ? 'var(--accent-color)' : 'white' }}
                  >
                    {USER_STATS.favoriteGenre}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Sur {USER_STATS.totalFilms} films archivés
                  </p>
                </div>
              </div>

              {/* Card Acteur — click active le hover effect */}
              <div
                onClick={() => setProfileActive(p => p === 'actor' ? null : 'actor')}
                className="relative rounded-2xl border p-6 overflow-hidden cursor-pointer select-none transition-all duration-500"
                style={{
                  backgroundColor: 'var(--card-color)',
                  borderColor: profileActive === 'actor'
                    ? 'color-mix(in srgb, var(--accent-color) 40%, transparent)'
                    : 'rgba(255,255,255,0.08)',
                  transform: profileActive === 'actor' ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: profileActive === 'actor' ? '0 12px 32px rgba(0,0,0,0.4)' : 'none',
                }}
              >
                <div
                  className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at 70% 50%, color-mix(in srgb, var(--accent-color) 10%, transparent), transparent 70%)',
                    opacity: profileActive === 'actor' ? 1 : 0,
                  }}
                />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Mic2
                      size={14}
                      style={{
                        color: 'var(--accent-color)',
                        transform: profileActive === 'actor' ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.3s',
                      }}
                    />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Acteur récurrent</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div
                        className="w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-500"
                        style={{
                          borderColor: profileActive === 'actor'
                            ? 'color-mix(in srgb, var(--accent-color) 60%, transparent)'
                            : 'rgba(255,255,255,0.1)',
                        }}
                      >
                        <img
                          src={USER_STATS.favoriteActorImg}
                          alt={USER_STATS.favoriteActor}
                          className="w-full h-full object-cover transition-transform duration-500"
                          style={{ transform: profileActive === 'actor' ? 'scale(1.1)' : 'scale(1)' }}
                        />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-[var(--bg-color)]"
                        style={{ backgroundColor: 'var(--accent-color)' }}>
                        <Mic2 size={9} style={{ color: 'var(--bg-color)' }} />
                      </div>
                    </div>
                    <div>
                      <p
                        className="text-xl font-black tracking-tighter leading-none mb-1 transition-colors duration-300"
                        style={{ color: profileActive === 'actor' ? 'var(--accent-color)' : 'white' }}
                      >
                        {USER_STATS.favoriteActor}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dans tes archives</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── 4. AJOUT + 3 BOUTONS MOBILE ── */}
          <div className="grid grid-cols-1 gap-6 pb-8">

            {/* Card Nouvelle séance */}
            <div
              className="relative rounded-2xl overflow-hidden border cursor-pointer group transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 active:scale-[0.99]"
              style={{
                borderColor: 'color-mix(in srgb, var(--accent-color) 30%, transparent)',
                background: 'color-mix(in srgb, var(--accent-color) 8%, var(--card-color, #111))',
              }}
              onClick={onGoToSearch}
            >
              <div className="absolute left-0 top-0 bottom-0 w-3.5 opacity-25 group-hover:opacity-40 transition-opacity"
                style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 12px, var(--accent-color) 12px, var(--accent-color) 24px)' }} />
              <div className="absolute right-0 top-0 bottom-0 w-3.5 opacity-25 group-hover:opacity-40 transition-opacity"
                style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 12px, var(--accent-color) 12px, var(--accent-color) 24px)' }} />
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--bg-color)]" />
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--bg-color)]" />
              <div className="absolute left-4 right-4 top-1/2 border-t border-dashed border-white/10" />
              <Clapperboard
                className="absolute right-5 top-1/2 -translate-y-1/2 opacity-[0.06] group-hover:opacity-[0.1] group-hover:rotate-6 transition-all duration-500"
                style={{ color: 'var(--accent-color)', width: 100, height: 100 }}
                strokeWidth={1}
              />
              <div className="absolute bottom-3 right-5 flex items-center justify-center opacity-30 group-hover:opacity-50 rotate-[-12deg] transition-opacity" style={{ color: 'var(--accent-color)' }}>
                <Stamp size={36} strokeWidth={1.5} />
                <span className="absolute text-[8px] font-black uppercase tracking-widest mt-0.5">Now</span>
              </div>
              <div className="relative z-10 px-10 py-10 flex flex-col justify-center h-full">
                <h3 className="text-3xl font-black tracking-tighter text-white uppercase leading-[0.9] mb-3">
                  T'as regardé<br />
                  un film ?<br />
                  <span style={{ color: 'var(--accent-color)' }}>Prouve-le.</span>
                </h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-5">
                  Note-le, juge-le, archive-le.<br />Avant que tu l'oublies demain matin.
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all group-hover:scale-105"
                    style={{ borderColor: 'var(--accent-color)', backgroundColor: 'color-mix(in srgb, var(--accent-color) 15%, transparent)' }}
                  >
                    <Plus size={22} style={{ color: 'var(--accent-color)' }} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">Ajouter un film</span>
                </div>
              </div>
            </div>

            {/* 3 Boutons avec accent sur label + click = hover 0.5s */}
            <div className="flex flex-col gap-3">
              {[
                {
                  icon: Star,
                  label: 'Mes',
                  labelAccent: 'Favoris',
                  sub: `${USER_STATS.eliteCount} films Élite`,
                  key: 'fav',
                  action: onGoToFilms,
                },
                {
                  icon: Heart,
                  label: 'Coups de',
                  labelAccent: 'Cœur',
                  sub: `${USER_STATS.heartCount} films qui t'ont marqué`,
                  key: 'heart',
                  action: onGoToFilms,
                },
                {
                  icon: Camera,
                  label: 'Sélection',
                  labelAccent: 'Hebdo',
                  sub: 'Découvre tes stats',
                  key: 'stats',
                  action: () => {},
                },
              ].map(({ icon: Icon, label, labelAccent, sub, key, action }) => (
                <button
                  key={key}
                  onClick={() => handleBtnClick(key, action)}
                  className="flex-1 flex items-center gap-5 p-5 rounded-3xl border transition-all text-left active:scale-[0.985] select-none relative overflow-hidden"
                  style={{
                    backgroundColor: 'var(--card-color, #111)',
                    borderColor: clickedBtn === key
                      ? 'color-mix(in srgb, var(--accent-color) 40%, transparent)'
                      : 'rgba(255,255,255,0.08)',
                    transform: clickedBtn === key ? 'translateY(-3px)' : 'translateY(0)',
                    boxShadow: clickedBtn === key ? '0 12px_32px rgba(0,0,0,0.4)' : 'none',
                    transition: 'all 0.5s ease',
                  }}
                >
                  {/* Glow gauche au click */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(90deg, color-mix(in srgb, var(--accent-color) 8%, transparent) 0%, transparent 60%)',
                      opacity: clickedBtn === key ? 1 : 0,
                    }}
                  />
                  <div
                    className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--accent-color) 12%, transparent)',
                      transform: clickedBtn === key ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    <Icon size={26} style={{ color: 'var(--accent-color)' }} />
                  </div>
                  <div className="relative z-10 flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5 flex-wrap mb-0.5">
                      <span className="text-white font-black text-xl tracking-tighter uppercase">{label}</span>
                      <span
                        className="font-black text-xl tracking-tighter uppercase"
                        style={{ color: 'var(--accent-color)' }}
                      >
                        {labelAccent}
                      </span>
                    </div>
                    <div
                      className="text-sm font-medium truncate transition-colors duration-500"
                      style={{ color: clickedBtn === key ? 'rgba(148,163,184,0.8)' : 'rgb(100,116,139)' }}
                    >
                      {sub}
                    </div>
                  </div>
                  <ArrowRight
                    size={20}
                    className="relative z-10 transition-all duration-500 shrink-0"
                    style={{
                      color: clickedBtn === key ? 'var(--accent-color)' : 'rgb(71,85,105)',
                      transform: clickedBtn === key ? 'translateX(4px)' : 'translateX(0)',
                    }}
                  />
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