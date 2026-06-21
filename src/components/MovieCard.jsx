import React, { useState } from 'react';
import {
  Star, Heart, Popcorn, Tag, Landmark, Rocket, Film, Swords
} from 'lucide-react';
import CardComplet from './Cardcomplet';

// ─── CONFIG ─────────────────────────────────────────────────────────────────
const SECTION_CONFIG = {
  elite: {
    label: 'Élite',
    base: 'bg-purple-600 text-white border-purple-400/40',
  },
  moyen: {
    label: 'Moyen',
    base: 'bg-amber-500 text-slate-950 border-amber-300/40',
  },
  navet: {
    label: 'Navet',
    base: 'bg-rose-600 text-white border-rose-400/40',
  },
};

const CATEGORY_STYLES = {
  Romance:  { icon: Heart,    style: 'bg-transparent text-pink-300 border-pink-500/40' },
  Histoire: { icon: Landmark, style: 'bg-transparent text-slate-300 border-slate-500/50' },
  'Sci-Fi': { icon: Rocket,   style: 'bg-transparent text-emerald-400 border-emerald-500/40' },
  Drame:    { icon: Film,     style: 'bg-transparent text-slate-300 border-slate-500/50' },
  Action:   { icon: Swords,   style: 'bg-transparent text-red-400 border-red-500/40' },
  default:  { icon: Tag,      style: 'bg-transparent text-slate-300 border-white/20' },
};

const Stars = ({ rating, size = 10 }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={size}
        className={i < rating
          ? 'fill-[var(--accent-color)] text-[var(--accent-color)]'
          : 'text-white/20'} />
    ))}
  </div>
);

// ─── COMPOSANT ──────────────────────────────────────────────────────────────
export default function MovieCard({
  title, year, genres = [], rating,
  synopsis, comment, section,
  posterUrl, actors = [],
  isFavorite, isHeart,
  onToggleFavorite, onToggleHeart,
}) {
  const [hovered, setHovered] = useState(false);
  const [isOpen,  setIsOpen]  = useState(false);
  const sec = SECTION_CONFIG[section] || SECTION_CONFIG.moyen;

  return (
    <>
      {/* ── CARD (expandable au hover) ── */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setIsOpen(true)}
        className="relative shrink-0 h-[450px] rounded-2xl overflow-hidden
          border cursor-pointer group
          transition-[width,border-color,box-shadow] duration-500 ease-in-out"
        style={{
          width:       hovered ? 580 : 300,
          borderColor: hovered
            ? 'color-mix(in srgb, var(--accent-color) 40%, transparent)'
            : 'rgba(255,255,255,0.1)',
          boxShadow:   hovered ? '0 25px 50px rgba(0,0,0,0.6)' : '0 10px 30px rgba(0,0,0,0.3)',
          backgroundColor: 'var(--card-color, #111)',
        }}
      >
        {/* Layout interne toujours 580px — le clip du wrapper fait le reste */}
        <div className="flex h-full" style={{ width: 580 }}>

          {/* ══ AFFICHE (300px fixe) ══ */}
          <div className="w-[300px] shrink-0 h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center
              transition-transform duration-700 group-hover:scale-[1.04]"
              style={{ backgroundImage: `url(${posterUrl})` }} />

            {/* Voile normal — disparaît au hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent
              transition-opacity duration-300 group-hover:opacity-0" />

            {/* Boutons ⭐ / ❤️ */}
            <div className="absolute top-4 right-4 flex gap-2 z-20">
              {onToggleFavorite && (
                <button
                  onClick={e => { e.stopPropagation(); onToggleFavorite(); }}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md
                    border border-white/20 flex items-center justify-center
                    hover:bg-black/70 hover:border-white/40 transition-all group/btn"
                >
                  <Star size={18} className={`transition-colors ${
                    isFavorite
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-white group-hover/btn:text-yellow-400'
                  }`} />
                </button>
              )}
              {onToggleHeart && (
                <button
                  onClick={e => { e.stopPropagation(); onToggleHeart(); }}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md
                    border border-white/20 flex items-center justify-center
                    hover:bg-black/70 hover:border-white/40 transition-all group/btn"
                >
                  <Heart size={18} className={`transition-colors ${
                    isHeart
                      ? 'fill-red-500 text-red-500'
                      : 'text-white group-hover/btn:text-red-500'
                  }`} />
                </button>
              )}
            </div>

            {/* Infos état normal */}
            <div className="absolute inset-0 flex flex-col justify-end p-5
              group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
              <div className={`self-start px-3 py-1.5 text-[10px] font-black
                tracking-[0.15em] uppercase rounded-lg border backdrop-blur-md mb-2
                ${sec.base}`}>
                {sec.label}
              </div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Stars rating={rating} size={12} />
                <span className="text-[10px] font-bold text-[var(--accent-color)]
                  tracking-widest uppercase ml-1">{year}</span>
              </div>
              <h3 className="text-[28px] font-black tracking-tighter text-white
                uppercase leading-[0.9] drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
                {title}
              </h3>
            </div>

            <Popcorn
              className="absolute bottom-4 right-4 text-white/5 opacity-0
                group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              size={80} strokeWidth={1}
            />
          </div>

          {/* ══ PANNEAU LATÉRAL (280px) ══ */}
          <div className="w-[280px] shrink-0 h-full
            bg-[var(--card-color,#0f0f0f)] border-l border-white/8
            flex flex-col overflow-hidden
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300 delay-[120ms]">

            <div className="px-5 pt-5 pb-3 border-b border-white/8 shrink-0">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1
                text-[9px] font-black tracking-[0.15em] uppercase rounded border mb-2.5
                ${sec.base}`}>
                {sec.label}
              </div>
              <h3 className="text-lg font-black tracking-tighter text-white
                uppercase leading-none mb-1">{title}</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[var(--accent-color)] uppercase tracking-widest">
                  {year}
                </span>
                <Stars rating={rating} size={9} />
              </div>
            </div>

            {/* Genres */}
            <div className="px-5 py-3 flex flex-wrap gap-1.5 border-b border-white/8 shrink-0">
              {genres.map((genre, i) => {
                const Cat  = CATEGORY_STYLES[genre] || CATEGORY_STYLES.default;
                const Icon = Cat.icon;
                return (
                  <span key={i} className={`flex items-center gap-1 text-[9px] font-bold
                    px-2 py-1 rounded border uppercase tracking-wide ${Cat.style}`}>
                    <Icon size={9} /> {genre}
                  </span>
                );
              })}
            </div>

            {/* Synopsis */}
            <div className="px-5 py-3 border-b border-white/8 flex-1 min-h-0">
              <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-5">
                {synopsis}
              </p>
            </div>

            {/* Avis */}
            <div className="px-5 py-3 border-t border-white/8 shrink-0">
              <p className="text-[10px] text-slate-400 italic leading-relaxed line-clamp-3">
                "{comment}"
              </p>
            </div>

            <div className="px-5 pb-4 pt-2 shrink-0 text-center">
              <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">
                Cliquer · Écran complet
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL COMPLET ── */}
      {isOpen && (
        <CardComplet
          title={title} year={year} genres={genres} rating={rating}
          synopsis={synopsis} comment={comment} section={section}
          posterUrl={posterUrl} actors={actors}
          isFavorite={isFavorite} isHeart={isHeart}
          onToggleFavorite={onToggleFavorite}
          onToggleHeart={onToggleHeart}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}