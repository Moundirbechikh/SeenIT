import React, { useState, useEffect } from 'react';
import {
  X, Star, Calendar, MessageSquare, Info,
  Users, Heart, ChevronLeft, ChevronRight,
  Pencil, Plus, Tag, Landmark, Rocket,
  Film, Swords
} from 'lucide-react';

// ─── CONFIG ─────────────────────────────────────────────────────────────────
const SECTION_CONFIG = {
  elite: { label: 'Élite', cls: 'bg-purple-600 text-white border-purple-400/40' },
  moyen: { label: 'Moyen', cls: 'bg-amber-500 text-slate-950 border-amber-300/40' },
  navet: { label: 'Navet', cls: 'bg-rose-600 text-white border-rose-400/40' },
};

const CATEGORY_STYLES = {
  Romance:  { icon: Heart,    style: 'bg-transparent text-pink-300 border-pink-500/40' },
  Histoire: { icon: Landmark, style: 'bg-transparent text-slate-300 border-slate-500/50' },
  'Sci-Fi': { icon: Rocket,   style: 'bg-transparent text-emerald-400 border-emerald-500/40' },
  Drame:    { icon: Film,     style: 'bg-transparent text-slate-300 border-slate-500/50' },
  Action:   { icon: Swords,   style: 'bg-transparent text-red-400 border-red-500/40' },
  default:  { icon: Tag,      style: 'bg-transparent text-slate-300 border-white/20' },
};

const Stars = ({ rating, size = 14 }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={size}
        className={i < rating
          ? 'fill-[var(--accent-color)] text-[var(--accent-color)]'
          : 'text-white/20'} />
    ))}
  </div>
);

// ─── MODAL JOURNAL (ajouter / modifier un avis) ──────────────────────────────
function JournalModal({ existing, onSave, onClose }) {
  const [text, setText] = useState(existing?.text || '');
  const [date, setDate] = useState(existing?.date || new Date().toISOString().slice(0, 10));

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-white/10 p-6 relative"
        style={{ backgroundColor: 'var(--card-color)' }}
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center
            rounded-full border border-white/10 text-white/50 hover:text-white
            hover:border-white/30 transition-all">
          <X size={14} />
        </button>
        <h3 className="text-lg font-black tracking-tighter text-white uppercase mb-4">
          {existing ? 'Modifier l\'avis' : 'Ajouter un avis'}
        </h3>
        <div className="mb-3">
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-1.5">
            Date de visionnage
          </label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="w-full bg-[var(--bg-color)] border border-white/10 text-white
              rounded-lg px-3 py-2 text-sm font-medium focus:outline-none
              focus:border-[var(--accent-color)] transition-colors" />
        </div>
        <div className="mb-5">
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-1.5">
            Mon avis
          </label>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={5}
            placeholder="Ce film m'a..."
            className="w-full bg-[var(--bg-color)] border border-white/10 text-white
              rounded-lg px-3 py-2 text-sm font-medium focus:outline-none
              focus:border-[var(--accent-color)] transition-colors resize-none
              placeholder:text-slate-600" />
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose}
            className="px-4 py-2 text-xs font-black uppercase tracking-widest
              border border-white/10 text-slate-400 rounded-lg hover:border-white/30
              hover:text-white transition-all">
            Annuler
          </button>
          <button onClick={() => { if (text.trim()) onSave({ text: text.trim(), date }); }}
            className="px-4 py-2 text-xs font-black uppercase tracking-widest
              rounded-lg transition-all"
            style={{ backgroundColor: 'var(--accent-color)', color: 'var(--bg-color)' }}>
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
}) {
  const sec = SECTION_CONFIG[section] || SECTION_CONFIG.moyen;

  // Avis multiples — initialise avec le commentaire existant
  const [avis, setAvis] = useState(() =>
    comment ? [{ text: comment, date: year + '-01-01' }] : []
  );
  const [avisIndex, setAvisIndex] = useState(0);
  const [journalModal, setJournalModal] = useState(null); // null | 'add' | number(index)

  // Bloquer le scroll du body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Fermer avec Escape
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
      {/* ── OVERLAY ── */}
      <div
        className="fixed inset-0 z-[500] flex overflow-hidden"
        style={{ backgroundColor: 'var(--bg-color)', animation: 'cf-fadein 0.25s ease-out' }}
      >
        {/* ══ DESKTOP ══ */}
        <div className="hidden lg:flex w-full h-full">

          {/* Poster gauche */}
          <div className="w-[36%] h-full relative shrink-0">
            <div className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${posterUrl})` }} />
            {/* Fondu vers la droite */}
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to right, transparent 60%, var(--bg-color) 100%)' }} />
            {/* Fondu bas léger */}
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)' }} />
            {/* Badge section */}
            <div className={`absolute bottom-8 left-8 px-3 py-1.5 text-[10px] font-black
              tracking-[0.15em] uppercase border backdrop-blur-sm ${sec.cls}`}>
              {sec.label}
            </div>
          </div>

          {/* Contenu droite */}
          <div className="flex-1 h-full flex flex-col px-10 py-8 overflow-y-auto relative">

            {/* Bouton fermer */}
            <button onClick={onClose}
              className="absolute top-6 right-6 z-10 w-9 h-9 flex items-center justify-center
                border border-white/10 text-white/50 rounded-full
                hover:border-white/30 hover:text-white transition-all duration-200
                hover:rotate-90">
              <X size={16} strokeWidth={2} />
            </button>

            {/* Titre + année */}
            <div className="mb-3 pr-12">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={11} style={{ color: 'var(--accent-color)' }} />
                <span className="text-[10px] font-black uppercase tracking-widest"
                  style={{ color: 'var(--accent-color)' }}>{year}</span>
              </div>
              <h2 className="font-black text-white uppercase tracking-tighter leading-[0.88] mb-3"
                style={{ fontSize: 'clamp(2rem, 4vw, 4.5rem)' }}>{title}</h2>
              <Stars rating={rating} size={16} />
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-5">
              {genres.map((genre, i) => {
                const Cat = CATEGORY_STYLES[genre] || CATEGORY_STYLES.default;
                const Icon = Cat.icon;
                return (
                  <span key={i} className={`flex items-center gap-1.5 text-[10px] font-bold
                    px-2.5 py-1 border uppercase tracking-wide ${Cat.style}`}>
                    <Icon size={10} /> {genre}
                  </span>
                );
              })}
            </div>

            {/* Synopsis — pas de background */}
            <div className="mb-6">
              <p className="text-slate-400 text-sm leading-relaxed max-w-2xl"
                style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {synopsis}
              </p>
            </div>

            {/* Séparateur */}
            <div className="h-px w-full bg-white/8 mb-6" />

            {/* Journal — avis avec navigation */}
            <div className="mb-6 flex-1">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare size={12} style={{ color: 'var(--accent-color)' }} />
                  <span className="text-[10px] font-black uppercase tracking-widest"
                    style={{ color: 'var(--accent-color)' }}>
                    Mon journal · {avis.length} avis
                  </span>
                </div>
                <button onClick={() => setJournalModal('add')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black
                    uppercase tracking-widest border border-white/10 text-slate-400
                    hover:border-white/30 hover:text-white transition-all rounded-lg">
                  <Plus size={10} /> Ajouter un avis
                </button>
              </div>

              {avis.length === 0 ? (
                <p className="text-slate-600 text-sm italic">Aucun avis pour l'instant.</p>
              ) : (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">
                      {new Date(currentAvis.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={() => setJournalModal(avisIndex)}
                      className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest
                        text-slate-600 hover:text-slate-300 transition-colors">
                      <Pencil size={9} /> Modifier
                    </button>
                  </div>
                  <p className="text-white text-sm leading-relaxed italic max-w-2xl">
                    "{currentAvis.text}"
                  </p>

                  {/* Dots navigation */}
                  {avis.length > 1 && (
                    <div className="flex items-center gap-2 mt-4">
                      <button onClick={() => setAvisIndex(i => Math.max(0, i - 1))}
                        disabled={avisIndex === 0}
                        className="w-6 h-6 flex items-center justify-center border border-white/10
                          text-white/40 hover:text-white hover:border-white/30 transition-all
                          disabled:opacity-20 disabled:cursor-not-allowed rounded">
                        <ChevronLeft size={12} />
                      </button>
                      {avis.map((_, i) => (
                        <button key={i} onClick={() => setAvisIndex(i)}
                          className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                          style={{
                            backgroundColor: i === avisIndex ? 'var(--accent-color)' : 'rgba(255,255,255,0.2)',
                            transform: i === avisIndex ? 'scale(1.3)' : 'scale(1)',
                          }} />
                      ))}
                      <button onClick={() => setAvisIndex(i => Math.min(avis.length - 1, i + 1))}
                        disabled={avisIndex === avis.length - 1}
                        className="w-6 h-6 flex items-center justify-center border border-white/10
                          text-white/40 hover:text-white hover:border-white/30 transition-all
                          disabled:opacity-20 disabled:cursor-not-allowed rounded">
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Séparateur */}
            <div className="h-px w-full bg-white/8 mb-5" />

            {/* Casting */}
            <div className="shrink-0 pb-2">
              <div className="flex items-center gap-2 mb-4">
                <Users size={11} className="text-white/30" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/30">
                  Têtes d'affiche
                </span>
              </div>
              <div className="flex gap-5 flex-wrap">
                {actors.map((actor, i) => (
                  <div key={i} className="flex items-center gap-3 group/actor">
                    <div className="w-11 h-11 rounded-full overflow-hidden border border-white/10
                      group-hover/actor:border-[var(--accent-color)] transition-colors duration-300 shrink-0">
                      <img src={actor.img} alt={actor.name}
                        className="w-full h-full object-cover grayscale
                          group-hover/actor:grayscale-0 transition-all duration-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-bold text-xs leading-tight truncate">{actor.name}</div>
                      <div className="text-[10px] font-black uppercase tracking-wide truncate"
                        style={{ color: 'var(--accent-color)' }}>{actor.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ MOBILE ══ */}
        <div className="flex lg:hidden w-full h-full flex-col overflow-y-auto">

          {/* Header compact : poster mini + infos essentielles */}
          <div className="relative shrink-0">
            {/* Poster en bannière courte */}
            <div className="w-full h-48 relative overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center scale-105"
                style={{ backgroundImage: `url(${posterUrl})`, filter: 'blur(2px)' }} />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, var(--bg-color) 100%)' }} />
              {/* Poster centré au-dessus */}
              <div className="absolute bottom-0 left-4 w-20 h-28 overflow-hidden border border-white/10 shrink-0">
                <img src={posterUrl} alt={title} className="w-full h-full object-cover" />
              </div>
              {/* Badge section */}
              <div className={`absolute top-4 left-4 px-2.5 py-1 text-[9px] font-black
                tracking-[0.15em] uppercase border backdrop-blur-sm ${sec.cls}`}>
                {sec.label}
              </div>
              {/* Bouton fermer */}
              <button onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center
                  border border-white/10 text-white/60 rounded-full
                  hover:border-white/30 hover:text-white transition-all bg-black/40 backdrop-blur-sm">
                <X size={14} />
              </button>
            </div>

            {/* Titre à côté du poster */}
            <div className="pt-2 pb-4 px-4 pl-28">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar size={10} style={{ color: 'var(--accent-color)' }} />
                <span className="text-[9px] font-black uppercase tracking-widest"
                  style={{ color: 'var(--accent-color)' }}>{year}</span>
              </div>
              <h2 className="font-black text-white uppercase tracking-tighter leading-[0.9] text-2xl mb-2">{title}</h2>
              <Stars rating={rating} size={12} />
            </div>
          </div>

          {/* Contenu scrollable */}
          <div className="flex-1 px-4 pb-8">

            {/* Genres */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {genres.map((genre, i) => {
                const Cat = CATEGORY_STYLES[genre] || CATEGORY_STYLES.default;
                const Icon = Cat.icon;
                return (
                  <span key={i} className={`flex items-center gap-1 text-[9px] font-bold
                    px-2 py-0.5 border uppercase tracking-wide ${Cat.style}`}>
                    <Icon size={9} /> {genre}
                  </span>
                );
              })}
            </div>

            {/* Synopsis — 3 lignes max sur mobile */}
            <p className="text-slate-400 text-xs leading-relaxed mb-5"
              style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {synopsis}
            </p>

            <div className="h-px w-full bg-white/8 mb-4" />

            {/* Journal mobile */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-black uppercase tracking-widest"
                  style={{ color: 'var(--accent-color)' }}>
                  Journal · {avis.length} avis
                </span>
                <button onClick={() => setJournalModal('add')}
                  className="flex items-center gap-1 px-2.5 py-1 text-[9px] font-black
                    uppercase tracking-widest border border-white/10 text-slate-400
                    hover:text-white transition-all rounded-lg">
                  <Plus size={9} /> Ajouter
                </button>
              </div>
              {avis.length === 0 ? (
                <p className="text-slate-600 text-xs italic">Aucun avis.</p>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">
                      {new Date(currentAvis.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <button onClick={() => setJournalModal(avisIndex)}
                      className="flex items-center gap-1 text-[8px] font-black uppercase
                        text-slate-600 hover:text-slate-300 transition-colors">
                      <Pencil size={8} /> Modifier
                    </button>
                  </div>
                  <p className="text-white text-xs leading-relaxed italic">"{currentAvis.text}"</p>
                  {avis.length > 1 && (
                    <div className="flex items-center gap-2 mt-3">
                      <button onClick={() => setAvisIndex(i => Math.max(0, i - 1))}
                        disabled={avisIndex === 0}
                        className="w-5 h-5 flex items-center justify-center border border-white/10
                          text-white/40 rounded disabled:opacity-20">
                        <ChevronLeft size={10} />
                      </button>
                      {avis.map((_, i) => (
                        <button key={i} onClick={() => setAvisIndex(i)}
                          className="w-1.5 h-1.5 rounded-full transition-all"
                          style={{
                            backgroundColor: i === avisIndex ? 'var(--accent-color)' : 'rgba(255,255,255,0.2)',
                            transform: i === avisIndex ? 'scale(1.3)' : 'scale(1)',
                          }} />
                      ))}
                      <button onClick={() => setAvisIndex(i => Math.min(avis.length - 1, i + 1))}
                        disabled={avisIndex === avis.length - 1}
                        className="w-5 h-5 flex items-center justify-center border border-white/10
                          text-white/40 rounded disabled:opacity-20">
                        <ChevronRight size={10} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="h-px w-full bg-white/8 mb-4" />

            {/* Casting mobile compact */}
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-3">
                Têtes d'affiche
              </span>
              <div className="flex gap-4 flex-wrap">
                {actors.slice(0, 3).map((actor, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 shrink-0">
                      <img src={actor.img} alt={actor.name} className="w-full h-full object-cover grayscale" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-[10px] leading-tight">{actor.name}</div>
                      <div className="text-[9px] font-black uppercase tracking-wide"
                        style={{ color: 'var(--accent-color)' }}>{actor.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal journal */}
      {journalModal !== null && (
        <JournalModal
          existing={journalModal !== 'add' ? avis[journalModal] : null}
          onSave={handleSaveAvis}
          onClose={() => setJournalModal(null)}
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