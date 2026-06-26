import React, { useState, useEffect } from 'react';
import {
  X, Star, Calendar, MessageSquare, Info,
  Heart, ChevronLeft, ChevronRight,
  Pencil, Plus, Tag, Rocket,
   Swords, Compass, Sparkles, Smile, Siren, Camera, Film, 
  Users, Wand2, Landmark, Skull, Music, Search, 
   Tv, Eye, Crosshair, Tent
} from 'lucide-react';

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


const Stars = ({ rating, size = 14 }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={size}
        className={i < rating
          ? 'fill-[var(--accent-color)] text-[var(--accent-color)]'
          : 'text-[var(--border-medium)]'} />
    ))}
  </div>
);

// ─── MODAL JOURNAL ────────────────────────────────────────────────────────────
function JournalModal({ existing, onSave, onClose, isLight }) {
  const [text, setText] = useState(existing?.text || '');
  const [date, setDate] = useState(existing?.date || new Date().toISOString().slice(0, 10));

  return (
    <div
      className="fixed inset-0 z-[600] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-2xl border p-6 relative ${isLight ? 'iconic-card-shimmer' : ''}`}
        style={{
          backgroundColor: 'var(--card-color)',
          borderColor: 'var(--border-subtle)',
          boxShadow: isLight ? '0 20px 60px rgba(0,0,0,0.2)' : '0 20px 60px rgba(0,0,0,0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border transition-all hover:rotate-90"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
        >
          <X size={14} />
        </button>

        <h3 className="text-lg font-black tracking-tighter uppercase mb-4" style={{ color: 'var(--text-primary)' }}>
          {existing ? "Modifier l'avis" : 'Ajouter un avis'}
        </h3>

        <div className="mb-3">
          <label className="text-[9px] font-black uppercase tracking-widest block mb-1.5" style={{ color: 'var(--text-muted)' }}>
            Date de visionnage
          </label>
          <input
            type="date" value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm font-medium focus:outline-none transition-colors"
            style={{
              backgroundColor: 'var(--bg-color)',
              border: `1px solid var(--border-subtle)`,
              color: 'var(--text-primary)',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
          />
        </div>

        <div className="mb-5">
          <label className="text-[9px] font-black uppercase tracking-widest block mb-1.5" style={{ color: 'var(--text-muted)' }}>
            Mon avis
          </label>
          <textarea
            value={text} onChange={e => setText(e.target.value)} rows={5}
            placeholder="Ce film m'a..."
            className="w-full rounded-lg px-3 py-2 text-sm font-medium focus:outline-none resize-none transition-colors"
            style={{
              backgroundColor: 'var(--bg-color)',
              border: `1px solid var(--border-subtle)`,
              color: 'var(--text-primary)',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg border transition-all"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
          >
            Annuler
          </button>
          <button
            onClick={() => { if (text.trim()) onSave({ text: text.trim(), date }); }}
            className="px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all"
            style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }}
          >
            {existing ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export default function CardComplet({
  title, year, genres = [], rating,
  synopsis, comment, section,
  posterUrl, actors = [],
  isFavorite, isHeart,
  onToggleFavorite, onToggleHeart,
  onClose,
  currentTheme,
}) {
  const sec      = SECTION_CONFIG[section] || SECTION_CONFIG.moyen;
  const isLight  = currentTheme?.isLight || false;
  const catStyles = isLight ? CATEGORY_STYLES_LIGHT : CATEGORY_STYLES;

  const [avis,         setAvis]         = useState(() => comment ? [{ text: comment, date: year + '-01-01' }] : []);
  const [avisIndex,    setAvisIndex]    = useState(0);
  const [journalModal, setJournalModal] = useState(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSaveAvis = ({ text, date }) => {
    if (journalModal === 'add') {
      setAvis(prev => {
        const next = [...prev, { text, date }];
        setAvisIndex(next.length - 1);
        return next;
      });
    } else {
      setAvis(prev => prev.map((a, i) => i === journalModal ? { text, date } : a));
    }
    setJournalModal(null);
  };

  const currentAvis = avis[avisIndex];

  return (
    <>
      <div
        className="fixed inset-0 z-[500] flex overflow-hidden"
        style={{ backgroundColor: 'var(--bg-color)', animation: 'cf-fadein 0.25s ease-out' }}
      >
        {/* ══ DESKTOP ══ */}
        <div className="hidden lg:flex w-full h-full">

          {/* Poster gauche */}
          <div className="w-[36%] h-full relative shrink-0">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${posterUrl})` }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 60%, var(--bg-color) 100%)' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)' }} />
            <div className={`absolute bottom-8 left-8 px-3 py-1.5 text-[10px] font-black tracking-[0.15em] uppercase border backdrop-blur-sm ${sec.cls}`}>
              {sec.label}
            </div>
          </div>

          {/* Contenu droite */}
          <div className="flex-1 h-full flex flex-col px-10 py-8 overflow-y-auto relative">

            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-9 h-9 flex items-center justify-center border rounded-full transition-all duration-200 hover:rotate-90"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
            >
              <X size={16} strokeWidth={2} />
            </button>

            {/* Titre + année */}
            <div className="mb-3 pr-12">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={11} style={{ color: 'var(--accent-color)' }} />
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--accent-color)' }}>{year}</span>
              </div>
              <h2
                className="font-black uppercase tracking-tighter leading-[0.88] mb-3"
                style={{ fontSize: 'clamp(2rem, 4vw, 4.5rem)', color: 'var(--text-primary)' }}
              >
                {title}
              </h2>
              <Stars rating={rating} size={16} />
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-5">
              {genres.map((genre, i) => {
                const Cat  = catStyles[genre] || catStyles.default;
                const Icon = Cat.icon;
                return (
                  <span key={i} className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 border uppercase tracking-wide ${Cat.style}`}>
                    <Icon size={10} /> {genre}
                  </span>
                );
              })}
            </div>

            {/* Synopsis */}
            <div className="mb-6">
              <p className="text-sm leading-relaxed max-w-2xl" style={{ color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {synopsis}
              </p>
            </div>

            <div className="h-px w-full mb-6" style={{ backgroundColor: 'var(--border-subtle)' }} />

            {/* Journal */}
            <div className="mb-6 flex-1">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare size={12} style={{ color: 'var(--accent-color)' }} />
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--accent-color)' }}>
                    Mon journal · {avis.length} avis
                  </span>
                </div>
                <button
                  onClick={() => setJournalModal('add')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border rounded-lg transition-all"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                >
                  <Plus size={10} /> Ajouter un avis
                </button>
              </div>

              {avis.length === 0 ? (
                <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>Aucun avis pour l'instant.</p>
              ) : (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                      {new Date(currentAvis.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <button
                      onClick={() => setJournalModal(avisIndex)}
                      className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Pencil size={9} /> Modifier
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed italic max-w-2xl" style={{ color: 'var(--text-primary)' }}>
                    "{currentAvis.text}"
                  </p>

                  {avis.length > 1 && (
                    <div className="flex items-center gap-2 mt-4">
                      <button
                        onClick={() => setAvisIndex(i => Math.max(0, i - 1))}
                        disabled={avisIndex === 0}
                        className="w-6 h-6 flex items-center justify-center border rounded transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                        onMouseEnter={e => { if (!e.currentTarget.disabled) { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-medium)'; }}}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                      >
                        <ChevronLeft size={12} />
                      </button>
                      {avis.map((_, i) => (
                        <button key={i} onClick={() => setAvisIndex(i)}
                          className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                          style={{
                            backgroundColor: i === avisIndex ? 'var(--accent-color)' : 'var(--border-medium)',
                            transform: i === avisIndex ? 'scale(1.3)' : 'scale(1)',
                          }} />
                      ))}
                      <button
                        onClick={() => setAvisIndex(i => Math.min(avis.length - 1, i + 1))}
                        disabled={avisIndex === avis.length - 1}
                        className="w-6 h-6 flex items-center justify-center border rounded transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                        onMouseEnter={e => { if (!e.currentTarget.disabled) { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-medium)'; }}}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                      >
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="h-px w-full mb-5" style={{ backgroundColor: 'var(--border-subtle)' }} />

            {/* Casting */}
            <div className="shrink-0 pb-2">
              <div className="flex items-center gap-2 mb-4">
                <Users size={11} style={{ color: 'var(--text-muted)' }} />
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Têtes d'affiche</span>
              </div>
              <div className="flex gap-5 flex-wrap">
                {actors.map((actor, i) => (
                  <div key={i} className="flex items-center gap-3 group/actor">
                    <div
                      className="w-11 h-11 rounded-full overflow-hidden border transition-colors duration-300 shrink-0"
                      style={{ borderColor: 'var(--border-subtle)' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                    >
                      <img src={actor.img} alt={actor.name} className="w-full h-full object-cover grayscale group-hover/actor:grayscale-0 transition-all duration-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs leading-tight truncate" style={{ color: 'var(--text-primary)' }}>{actor.name}</div>
                      <div className="text-[10px] font-black uppercase tracking-wide truncate" style={{ color: 'var(--accent-color)' }}>{actor.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ MOBILE ══ */}
        <div className="flex lg:hidden w-full h-full flex-col overflow-y-auto">

          {/* Header compact */}
          <div className="relative shrink-0">
            <div className="w-full h-48 relative overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: `url(${posterUrl})`, filter: 'blur(2px)' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, var(--bg-color) 100%)' }} />
              <div className="absolute bottom-0 left-4 w-20 h-28 overflow-hidden border border-white/10 shrink-0">
                <img src={posterUrl} alt={title} className="w-full h-full object-cover" />
              </div>
              <div className={`absolute top-4 left-4 px-2.5 py-1 text-[9px] font-black tracking-[0.15em] uppercase border backdrop-blur-sm ${sec.cls}`}>
                {sec.label}
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border rounded-full transition-all bg-black/40 backdrop-blur-sm hover:rotate-90"
                style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
              >
                <X size={14} />
              </button>
            </div>

            <div className="pt-2 pb-4 px-4 pl-28">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar size={10} style={{ color: 'var(--accent-color)' }} />
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--accent-color)' }}>{year}</span>
              </div>
              <h2 className="font-black uppercase tracking-tighter leading-[0.9] text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h2>
              <Stars rating={rating} size={12} />
            </div>
          </div>

          {/* Contenu scrollable mobile */}
          <div className="flex-1 px-4 pb-8">

            {/* Genres */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {genres.map((genre, i) => {
                const Cat  = catStyles[genre] || catStyles.default;
                const Icon = Cat.icon;
                return (
                  <span key={i} className={`flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 border uppercase tracking-wide ${Cat.style}`}>
                    <Icon size={9} /> {genre}
                  </span>
                );
              })}
            </div>

            <p className="text-xs leading-relaxed mb-5" style={{ color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {synopsis}
            </p>

            <div className="h-px w-full mb-4" style={{ backgroundColor: 'var(--border-subtle)' }} />

            {/* Journal mobile */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--accent-color)' }}>
                  Journal · {avis.length} avis
                </span>
                <button
                  onClick={() => setJournalModal('add')}
                  className="flex items-center gap-1 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border rounded-lg transition-all"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                >
                  <Plus size={9} /> Ajouter
                </button>
              </div>
              {avis.length === 0 ? (
                <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>Aucun avis.</p>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                      {new Date(currentAvis.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <button
                      onClick={() => setJournalModal(avisIndex)}
                      className="flex items-center gap-1 text-[8px] font-black uppercase transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Pencil size={8} /> Modifier
                    </button>
                  </div>
                  <p className="text-xs leading-relaxed italic" style={{ color: 'var(--text-primary)' }}>"{currentAvis.text}"</p>
                  {avis.length > 1 && (
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => setAvisIndex(i => Math.max(0, i - 1))}
                        disabled={avisIndex === 0}
                        className="w-5 h-5 flex items-center justify-center border rounded disabled:opacity-20"
                        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                      >
                        <ChevronLeft size={10} />
                      </button>
                      {avis.map((_, i) => (
                        <button key={i} onClick={() => setAvisIndex(i)}
                          className="w-1.5 h-1.5 rounded-full transition-all"
                          style={{ backgroundColor: i === avisIndex ? 'var(--accent-color)' : 'var(--border-medium)', transform: i === avisIndex ? 'scale(1.3)' : 'scale(1)' }} />
                      ))}
                      <button
                        onClick={() => setAvisIndex(i => Math.min(avis.length - 1, i + 1))}
                        disabled={avisIndex === avis.length - 1}
                        className="w-5 h-5 flex items-center justify-center border rounded disabled:opacity-20"
                        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                      >
                        <ChevronRight size={10} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="h-px w-full mb-4" style={{ backgroundColor: 'var(--border-subtle)' }} />

            {/* Casting mobile */}
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest block mb-3" style={{ color: 'var(--text-muted)' }}>
                Têtes d'affiche
              </span>
              <div className="flex gap-4 flex-wrap">
                {actors.slice(0, 3).map((actor, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full overflow-hidden border shrink-0" style={{ borderColor: 'var(--border-subtle)' }}>
                      <img src={actor.img} alt={actor.name} className="w-full h-full object-cover grayscale" />
                    </div>
                    <div>
                      <div className="font-bold text-[10px] leading-tight" style={{ color: 'var(--text-primary)' }}>{actor.name}</div>
                      <div className="text-[9px] font-black uppercase tracking-wide" style={{ color: 'var(--accent-color)' }}>{actor.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {journalModal !== null && (
        <JournalModal
          existing={journalModal !== 'add' ? avis[journalModal] : null}
          onSave={handleSaveAvis}
          onClose={() => setJournalModal(null)}
          isLight={isLight}
        />
      )}

      <style>{`
        @keyframes cf-fadein {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
}