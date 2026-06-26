import React, { useState } from 'react';
import { 
  Swords, Compass, Sparkles, Smile, Siren, Camera, Film, 
  Users, Wand2, Landmark, Skull, Music, Search, Heart, 
  Rocket, Tv, Eye, Crosshair, Tent, Tag,Star, Popcorn,Crown, Award, ThumbsUp, Meh, ThumbsDown, Zap
} from 'lucide-react';
import CardComplet from './Cardcomplet';

// ─── CONFIG ──────────────────────────────────────────────────────────────────
export const SECTION_CONFIG = {
  chefdoeuvre: {
    label: 'Chef-d\'œuvre',
    short: 'C.D\'Œ',
    cls:   'border-yellow-400/70 text-yellow-300 bg-yellow-500/15',
    icon:  Crown,
    desc:  'Parfait. À voir absolument.',
    color: '#EAB308',
  },
  elite: {
    label: 'Élite',
    short: 'ÉLITE',
    cls:   'border-purple-500/60 text-purple-300 bg-purple-600/15',
    icon:  Award,
    desc:  'Excellent. Marqué à vie.',
    color: '#A855F7',
  },
  bien: {
    label: 'Bien',
    short: 'BIEN',
    cls:   'border-emerald-500/60 text-emerald-300 bg-emerald-600/15',
    icon:  ThumbsUp,
    desc:  'Bon film. Content de l\'avoir vu.',
    color: '#10B981',
  },
  moyen: {
    label: 'Moyen',
    short: 'MOYEN',
    cls:   'border-amber-400/60 text-amber-300 bg-amber-500/15',
    icon:  Meh,
    desc:  'Correct. Pas de regrets, pas d\'ovation.',
    color: '#F59E0B',
  },
  decu: {
    label: 'Déçu',
    short: 'DÉÇU',
    cls:   'border-orange-500/60 text-orange-300 bg-orange-600/15',
    icon:  ThumbsDown,
    desc:  'En dessous des espérances.',
    color: '#F97316',
  },
  navet: {
    label: 'Navet',
    short: 'NAVET',
    cls:   'border-rose-500/60 text-rose-300 bg-rose-600/15',
    icon:  Zap,
    desc:  'Tu t\'es sacrifié. Noté pour ne plus recommencer.',
    color: '#F43F5E',
  },
};

const CATEGORY_STYLES = {
  Action:        { icon: Swords,    style: 'bg-transparent text-red-400 border-red-500/40' },
  Aventure:      { icon: Compass,   style: 'bg-transparent text-amber-400 border-amber-500/40' },
  Animation:     { icon: Sparkles,  style: 'bg-transparent text-violet-400 border-violet-500/40' },
  Comédie:       { icon: Smile,     style: 'bg-transparent text-yellow-400 border-yellow-500/40' },
  Crime:         { icon: Siren,     style: 'bg-transparent text-rose-400 border-rose-500/40' },
  Documentaire:  { icon: Camera,    style: 'bg-transparent text-teal-400 border-teal-500/40' },
  Drame:         { icon: Film,      style: 'bg-transparent text-slate-300 border-slate-500/50' },
  Familial:      { icon: Users,     style: 'bg-transparent text-sky-400 border-sky-500/40' },
  Fantastique:   { icon: Wand2,     style: 'bg-transparent text-fuchsia-400 border-fuchsia-500/40' },
  Histoire:      { icon: Landmark,  style: 'bg-transparent text-orange-300 border-orange-500/40' },
  Horreur:       { icon: Skull,     style: 'bg-transparent text-zinc-300 border-zinc-500/40' },
  Musique:       { icon: Music,     style: 'bg-transparent text-pink-400 border-pink-500/40' },
  Mystère:       { icon: Search,    style: 'bg-transparent text-indigo-400 border-indigo-500/40' },
  Romance:       { icon: Heart,     style: 'bg-transparent text-pink-300 border-pink-500/40' },
  'Sci-Fi':      { icon: Rocket,    style: 'bg-transparent text-emerald-400 border-emerald-500/40' },
  Téléfilm:      { icon: Tv,        style: 'bg-transparent text-blue-400 border-blue-500/40' },
  Thriller:      { icon: Eye,       style: 'bg-transparent text-red-500 border-red-600/40' },
  Guerre:        { icon: Crosshair, style: 'bg-transparent text-stone-400 border-stone-500/40' },
  Western:       { icon: Tent,      style: 'bg-transparent text-orange-400 border-orange-500/40' },
  default:       { icon: Tag,       style: 'bg-transparent text-slate-300 border-white/20' },
};

// Surcharges de styles de catégorie pour le thème clair
const CATEGORY_STYLES_LIGHT = {
  Action:        { icon: Swords,    style: 'bg-transparent text-red-600 border-red-400/50' },
  Aventure:      { icon: Compass,   style: 'bg-transparent text-amber-600 border-amber-400/50' },
  Animation:     { icon: Sparkles,  style: 'bg-transparent text-violet-600 border-violet-400/50' },
  Comédie:       { icon: Smile,     style: 'bg-transparent text-yellow-600 border-yellow-400/50' },
  Crime:         { icon: Siren,     style: 'bg-transparent text-rose-600 border-rose-400/50' },
  Documentaire:  { icon: Camera,    style: 'bg-transparent text-teal-600 border-teal-400/50' },
  Drame:         { icon: Film,      style: 'bg-transparent text-stone-600 border-stone-400/50' },
  Familial:      { icon: Users,     style: 'bg-transparent text-sky-600 border-sky-400/50' },
  Fantastique:   { icon: Wand2,     style: 'bg-transparent text-fuchsia-600 border-fuchsia-400/50' },
  Histoire:      { icon: Landmark,  style: 'bg-transparent text-orange-600 border-orange-400/50' },
  Horreur:       { icon: Skull,     style: 'bg-transparent text-zinc-700 border-zinc-500/50' },
  Musique:       { icon: Music,     style: 'bg-transparent text-pink-600 border-pink-400/50' },
  Mystère:       { icon: Search,    style: 'bg-transparent text-indigo-600 border-indigo-400/50' },
  Romance:       { icon: Heart,     style: 'bg-transparent text-pink-600 border-pink-400/50' },
  'Sci-Fi':      { icon: Rocket,    style: 'bg-transparent text-emerald-700 border-emerald-500/40' },
  Téléfilm:      { icon: Tv,        style: 'bg-transparent text-blue-600 border-blue-400/50' },
  Thriller:      { icon: Eye,       style: 'bg-transparent text-red-700 border-red-500/50' },
  Guerre:        { icon: Crosshair, style: 'bg-transparent text-stone-700 border-stone-500/50' },
  Western:       { icon: Tent,      style: 'bg-transparent text-orange-700 border-orange-500/50' },
  default:       { icon: Tag,       style: 'bg-transparent text-stone-500 border-stone-400/30' },
};

const Stars = ({ rating, size = 10 }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={size}
        className={i < rating
          ? 'fill-[var(--accent-color)] text-[var(--accent-color)]'
          : 'text-[var(--border-medium)]'} />
    ))}
  </div>
);

// ─── COMPOSANT ───────────────────────────────────────────────────────────────
export default function MovieCard({
  title, year, genres = [], rating,
  synopsis, comment, section,
  posterUrl, actors = [],
  isFavorite, isHeart,
  onToggleFavorite, onToggleHeart,
  currentTheme,
}) {
  const [hovered, setHovered] = useState(false);
  const [isOpen,  setIsOpen]  = useState(false);
  const sec      = SECTION_CONFIG[section] || SECTION_CONFIG.moyen;
  const isLight  = currentTheme?.isLight || false;
  const catStyles = isLight ? CATEGORY_STYLES_LIGHT : CATEGORY_STYLES;

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setIsOpen(true)}
        className={`relative shrink-0 h-[450px] rounded-2xl overflow-hidden border cursor-pointer group transition-[width,border-color,box-shadow] duration-500 ease-in-out ${isLight ? 'iconic-card-shimmer' : ''}`}
        style={{
          width:           hovered ? 580 : 300,
          borderColor:     hovered
            ? 'color-mix(in srgb, var(--accent-color) 40%, transparent)'
            : 'var(--border-subtle)',
          boxShadow:       hovered
            ? `0 25px 50px ${isLight ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.6)'}`
            : `0 10px 30px ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.3)'}`,
          backgroundColor: 'var(--card-color)',
        }}
      >
        {/* Layout interne 580px fixe */}
        <div className="flex h-full" style={{ width: 580 }}>

          {/* ══ AFFICHE ══ */}
          <div className="w-[300px] shrink-0 h-full relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.04]"
              style={{ backgroundImage: `url(${posterUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-0" />

            {/* Boutons ⭐ / ❤️ */}
            <div className="absolute top-4 right-4 flex gap-2 z-20">
              {onToggleFavorite && (
                <button
                  onClick={e => { e.stopPropagation(); onToggleFavorite(); }}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/70 hover:border-white/40 transition-all group/btn"
                >
                  <Star size={18} className={`transition-colors ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-white group-hover/btn:text-yellow-400'}`} />
                </button>
              )}
              {onToggleHeart && (
                <button
                  onClick={e => { e.stopPropagation(); onToggleHeart(); }}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/70 hover:border-white/40 transition-all group/btn"
                >
                  <Heart size={18} className={`transition-colors ${isHeart ? 'fill-red-500 text-red-500' : 'text-white group-hover/btn:text-red-500'}`} />
                </button>
              )}
            </div>

            {/* Infos état normal */}
            <div className="absolute inset-0 flex flex-col justify-end p-5 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
              <div className={`self-start px-3 py-1.5 text-[10px] font-black tracking-[0.15em] uppercase rounded-lg border backdrop-blur-md mb-2 ${sec.base}`}>
                {sec.label}
              </div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Stars rating={rating} size={12} />
                <span className="text-[10px] font-bold tracking-widest uppercase ml-1" style={{ color: 'var(--accent-color)' }}>{year}</span>
              </div>
              <h3 className="text-[28px] font-black tracking-tighter text-white uppercase leading-[0.9] drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
                {title}
              </h3>
            </div>

            <Popcorn
              className="absolute bottom-4 right-4 text-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              size={80} strokeWidth={1}
            />
          </div>

          {/* ══ PANNEAU LATÉRAL ══ */}
          <div
            className="w-[280px] shrink-0 h-full flex flex-col overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[120ms]"
            style={{ backgroundColor: 'var(--card-color)', borderLeft: '1px solid var(--border-subtle)' }}
          >
            <div className="px-5 pt-5 pb-3 shrink-0" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-black tracking-[0.15em] uppercase rounded border mb-2.5 ${sec.base}`}>
                {sec.label}
              </div>
              <h3 className="text-lg font-black tracking-tighter uppercase leading-none mb-1" style={{ color: 'var(--text-primary)' }}>{title}</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent-color)' }}>{year}</span>
                <Stars rating={rating} size={9} />
              </div>
            </div>

            {/* Genres */}
            <div className="px-5 py-3 flex flex-wrap gap-1.5 shrink-0" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {genres.map((genre, i) => {
                const Cat  = catStyles[genre] || catStyles.default;
                const Icon = Cat.icon;
                return (
                  <span key={i} className={`flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded border uppercase tracking-wide ${Cat.style}`}>
                    <Icon size={9} /> {genre}
                  </span>
                );
              })}
            </div>

            {/* Synopsis */}
            <div className="px-5 py-3 flex-1 min-h-0" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <p className="text-[11px] leading-relaxed line-clamp-5" style={{ color: 'var(--text-secondary)' }}>
                {synopsis}
              </p>
            </div>

            {/* Avis */}
            <div className="px-5 py-3 shrink-0" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <p className="text-[10px] italic leading-relaxed line-clamp-3" style={{ color: 'var(--text-muted)' }}>
                "{comment}"
              </p>
            </div>

            <div className="px-5 pb-4 pt-2 shrink-0 text-center">
              <span className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--border-medium)' }}>
                Cliquer · Écran complet
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal complet */}
      {isOpen && (
        <CardComplet
          title={title} year={year} genres={genres} rating={rating}
          synopsis={synopsis} comment={comment} section={section}
          posterUrl={posterUrl} actors={actors}
          isFavorite={isFavorite} isHeart={isHeart}
          onToggleFavorite={onToggleFavorite}
          onToggleHeart={onToggleHeart}
          onClose={() => setIsOpen(false)}
          currentTheme={currentTheme}
        />
      )}
    </>
  );
}