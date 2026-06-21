import React, { useState, useEffect } from 'react';
import {
  Plus, Clapperboard, Film, Popcorn,
  Star, Heart, Trophy, Mic2, Clock,
  ArrowRight, Zap, Stamp, Camera, Ticket,Hand
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

const USER_STATS = {
  name: 'Moundir',
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
  const sec = SECTION_COLORS[LAST_FILM.section] || SECTION_COLORS.moyen;

  useEffect(() => { setMounted(true); }, []);

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
        <section className="hidden lg:flex min-h-[calc(100vh-80px)] flex-col relative z-20">
          <div className="flex-1 flex items-center justify-center gap-16 w-full py-8">

            {/* ── PARTIE GAUCHE : Texte + Profil ── */}
            <div
              className={`flex-1 text-left max-w-xl transform transition-all duration-1000 ease-out ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}
            >
{/* Titre principal — style Landing */}
<h1 className="flex flex-wrap items-baseline gap-0 font-black text-6xl xl:text-7xl tracking-tighter text-white mb-3">
BIENV
  <span 
    className="text-6xl xl:text-7xl inline-block shadow-2xl tracking-tighter py-1"
    style={{ color: 'var(--bg-color)', backgroundColor: 'var(--accent-color)' }}
  >
    ENUE,
  </span>
  <span
    className="text-8xl xl:text-9xl inline-block shadow-2xl leading-[0.8] tracking-tighter"
    style={{ color: 'var(--accent-color)' }}
  >
    {USER_STATS.name}.
  </span>
</h1>

              {/* Message de bienvenue */}
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl mb-7">
                Merci d'avoir choisi SeenIt pour archiver ta passion du cinéma.<br />
                Tu as déjà archivé <span className="text-white font-bold">{USER_STATS.totalFilms} films</span> dont{' '}
                <span style={{ color: 'var(--accent-color)' }} className="font-bold">{USER_STATS.eliteCount} classés Élite</span>. Prêt pour la prochaine pépite ?
              </p>

              {/* ── Cards Profil Cinéphile ── */}
              <div>
                <h2 className="text-xl font-black tracking-tighter text-white uppercase mb-4 flex items-center gap-3">
                  Ton profil{' '}
                  <span className="text-md py-1" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--bg-color)' }}>
                    cinéphile
                  </span>
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  {/* Genre dominant */}
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

                  {/* Acteur récurrent */}
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
              {/* Ticket Gauche — Infos */}
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

              {/* Ticket Droite — Affiche */}
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

          {/* ── BANDE BAS DESKTOP : Nouvelle séance (compacte) + 3 boutons ── */}
          <div className="grid grid-cols-[auto_1fr] gap-5 pb-10 items-stretch">

            {/* Card Nouvelle séance — compacte, style Auth/Ticket */}
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

            {/* 3 boutons relookés */}
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
          {/* Salutation Mobile */}
          <div className="mb-8 pt-4">
            {/* Salutation Mobile */}
<h1 className="flex flex-wrap items-baseline text-4xl sm:text-5xl gap-0 font-black tracking-tighter text-white leading-none mb-1">BIENV
  <span className="text-4xl sm:text-5xl inline-block shadow-2xl tracking-tighter"
  style={{ backgroundColor: 'var(--accent-color)', color: 'var(--bg-color)' }}>
    ENUE,
  </span>
  <span 
    className="text-6xl sm:text-7xl inline-block shadow-2xl tracking-tighter" 
    style={{  color: 'var(--accent-color)' }}
  >
    {USER_STATS.name}.
  </span>
</h1>
            <p className="text-slate-500 text-sm font-medium mt-3">
              {USER_STATS.totalFilms} films archivés · {USER_STATS.eliteCount} classés Élite
            </p>
          </div>

          <div className="h-px w-full bg-white/8 mb-8" />

          {/* Dernier film Mobile */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <Clock size={12} style={{ color: 'var(--accent-color)' }} />
              <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-white uppercase leading-none">
                Dernier film <span className="inline-block shadow-xl" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--bg-color)' }}>vu</span>
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-0 relative h-auto sm:h-[420px]">
              {/* Ticket Gauche */}
              <div className="relative w-full sm:absolute sm:left-[5%] sm:w-64 h-[380px] sm:h-[400px] shadow-2xl overflow-hidden cursor-pointer transition-all duration-500 origin-bottom border-2 border-white/5 sm:-rotate-6 hover:rotate-0 hover:z-30 hover:scale-105 group z-20" onClick={onGoToFilms}>
                <img src={LAST_FILM.posterUrl} alt={LAST_FILM.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < LAST_FILM.rating ? 'currentColor' : 'none'} className={i < LAST_FILM.rating ? 'text-[var(--accent-color)]' : 'text-white/30'} />
                      ))}
                    </div>
                    <h3 className="font-black text-white text-xl uppercase tracking-tight mb-1">{LAST_FILM.title}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent-color)' }}>{LAST_FILM.year}</span>
                  </div>
                </div>
                <div className={`absolute top-4 left-4 px-2.5 py-1 text-[9px] font-black tracking-[0.15em] uppercase rounded border backdrop-blur-md ${sec.cls}`}>{sec.label}</div>
              </div>

              {/* Ticket Droit */}
              <div className="relative w-full sm:absolute sm:right-[5%] sm:w-64 h-auto sm:h-[400px] bg-[var(--card-color)] border border-white/10 shadow-2xl flex flex-col items-center justify-center p-8 text-center transition-all duration-300 origin-bottom cursor-pointer sm:rotate-6 hover:rotate-0 hover:z-30 hover:scale-105 z-10"
                style={{ clipPath: 'polygon(0 40px, 4px 34px, 1px 28px, 7px 20px, 3px 12px, 12px 6px, 20px 0, 100% 0, 100% 100%, 0 100%)' }}
                onClick={onGoToFilms}>
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
                      <Star key={i} size={16} fill={i < LAST_FILM.rating ? 'currentColor' : 'none'} className={i < LAST_FILM.rating ? 'text-[var(--accent-color)]' : 'text-white/20'} />
                    ))}
                  </div>
                  <h3 className="text-xl font-black tracking-tighter text-white uppercase mb-1">{LAST_FILM.title}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: 'var(--accent-color)' }}>{LAST_FILM.watchedAt} · {LAST_FILM.year}</p>
                  <p className="text-sm font-black tracking-tighter text-slate-100 leading-snug bg-[var(--card-color)]/50 backdrop-blur-sm p-3 rounded-lg">
                    <span style={{ color: 'var(--accent-color)', fontSize: '1.5rem' }}>"</span>
                    {LAST_FILM.comment}
                    <span style={{ color: 'var(--accent-color)', fontSize: '1.5rem' }}>"</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profil Mobile */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-white uppercase mb-6">Ton profil <span className="inline-block px-2 shadow-xl" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--bg-color)' }}>cinéphile</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative rounded-2xl border border-white/8 p-6 bg-[var(--card-color)]">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy size={14} style={{ color: 'var(--accent-color)' }} />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Genre dominant</span>
                </div>
                <p className="text-4xl font-black text-white uppercase leading-none mb-2">{USER_STATS.favoriteGenre}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sur {USER_STATS.totalFilms} films archivés</p>
              </div>
              <div className="relative rounded-2xl border border-white/8 p-6 bg-[var(--card-color)]">
                <div className="flex items-center gap-2 mb-4">
                  <Mic2 size={14} style={{ color: 'var(--accent-color)' }} />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Acteur récurrent</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10">
                    <img src={USER_STATS.favoriteActorImg} alt={USER_STATS.favoriteActor} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white uppercase leading-none mb-1">{USER_STATS.favoriteActor}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dans tes archives</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ajout + Boutons Mobile */}
          <div className="grid grid-cols-1 gap-6 pb-8">

            {/* Card Nouvelle séance Mobile — même style que desktop */}
            <div
              className="relative rounded-2xl overflow-hidden border cursor-pointer group transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 active:scale-[0.99]"
              style={{
                borderColor: 'color-mix(in srgb, var(--accent-color) 30%, transparent)',
                background: 'color-mix(in srgb, var(--accent-color) 8%, var(--card-color, #111))',
              }}
              onClick={onGoToSearch}
            >
              {/* Film strips gauche/droite */}
              <div className="absolute left-0 top-0 bottom-0 w-3.5 opacity-25 group-hover:opacity-40 transition-opacity"
                style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 12px, var(--accent-color) 12px, var(--accent-color) 24px)' }} />
              <div className="absolute right-0 top-0 bottom-0 w-3.5 opacity-25 group-hover:opacity-40 transition-opacity"
                style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 12px, var(--accent-color) 12px, var(--accent-color) 24px)' }} />
              {/* Demi-cercles ticket */}
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--bg-color)]" />
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--bg-color)]" />
              <div className="absolute left-4 right-4 top-1/2 border-t border-dashed border-white/10" />
              {/* Clap watermark */}
              <Clapperboard
                className="absolute right-5 top-1/2 -translate-y-1/2 opacity-[0.06] group-hover:opacity-[0.1] group-hover:rotate-6 transition-all duration-500"
                style={{ color: 'var(--accent-color)', width: 100, height: 100 }}
                strokeWidth={1}
              />
              {/* Stamp */}
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

            {/* 3 Boutons Mobile */}
            <div className="flex flex-col gap-3">
              {[
                { icon: Star, label: 'Mes Favoris', sub: `${USER_STATS.eliteCount} films Élite`, action: onGoToFilms },
                { icon: Heart, label: 'Coups de ❤️', sub: `${USER_STATS.heartCount} films`, action: onGoToFilms },
                { icon: Camera, label: 'Sélection hebdo', sub: 'Découvre tes stats', action: () => {} },
              ].map(({ icon: Icon, label, sub, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="flex-1 flex items-center gap-5 p-6 rounded-3xl border border-white/8 hover:border-[var(--accent-color)]/40 transition-all group text-left active:scale-[0.985]"
                  style={{ backgroundColor: 'var(--card-color, #111)' }}
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'color-mix(in srgb, var(--accent-color) 12%, transparent)' }}>
                    <Icon size={26} style={{ color: 'var(--accent-color)' }} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-black text-xl tracking-tighter uppercase">{label}</div>
                    <div className="text-slate-500 text-sm font-medium">{sub}</div>
                  </div>
                  <ArrowRight size={22} className="text-slate-600 group-hover:text-[var(--accent-color)] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}