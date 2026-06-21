import React, { useState } from 'react';
import { Film, Popcorn, Clapperboard, SlidersHorizontal, Star, Heart, ChevronLeft } from 'lucide-react';
import MovieCard from '../components/MovieCard';

const INITIAL_FILMS = [
  {
    title: 'Interstellar',
    year: '2014',
    genres: ['Sci-Fi', 'Drame'],
    rating: 5,
    section: 'elite',
    isFavorite: true,
    isHeart: false,
    synopsis: "Dans un futur proche, la Terre se meurt. Un ancien pilote de la NASA part à travers un trou de ver à la recherche d'une nouvelle planète habitable pour l'humanité, laissant derrière lui sa famille et tout ce qu'il connaît.",
    comment: "Visuellement fou. J'ai rien compris à la 5ème dimension mais la musique de Hans Zimmer sauve tout. Le film qui m'a donné envie de lire sur la physique quantique.",
    posterUrl: 'https://image.tmdb.org/t/p/w500/1pnigkWWy8W032o9TKDneBa3eVK.jpg',
    actors: [
      { name: 'M. McConaughey', role: 'Cooper',    img: 'https://image.tmdb.org/t/p/w200/wJiGedOCZhwMx9DezY8uwbNxmAY.jpg' },
      { name: 'A. Hathaway',    role: 'Brand',     img: 'https://image.tmdb.org/t/p/w200/tLelKoPNiyJCSEtQTz1FGv4TLGc.jpg' },
      { name: 'J. Chastain',    role: 'Murph',     img: 'https://image.tmdb.org/t/p/w200/nxfzMSMbTnaPJXoIPFUBF8BXLV3.jpg' },
      { name: 'M. Caine',       role: 'Brand Sr.', img: 'https://image.tmdb.org/t/p/w200/jQIMoFyGRly6vKRb6OVy4fKhgBu.jpg' },
    ],
  },
  {
    title: 'Matrix',
    year: '1999',
    genres: ['Sci-Fi', 'Action'],
    rating: 5,
    section: 'elite',
    isFavorite: false,
    isHeart: true,
    synopsis: "Thomas Anderson, programmeur le jour et hacker la nuit sous le pseudonyme Neo, est contacté par des rebelles qui lui révèlent une vérité choc : le monde qu'il connaît n'est qu'une simulation informatique appelée la Matrice.",
    comment: "Pilule rouge direct. Ce film a redéfini ma vision de la réalité. Et de l'action. Et de la narration. Tout simplement.",
    posterUrl: 'https://image.tmdb.org/t/p/w500/pEoqbqtLc4CcwDUDqxmEDSWpWTZ.jpg',
    actors: [
      { name: 'K. Reeves',     role: 'Neo',         img: 'https://image.tmdb.org/t/p/w200/4D0PpNI0kmP58hgrwGC3wCjxhnm.jpg' },
      { name: 'L. Fishburne',  role: 'Morpheus',    img: 'https://image.tmdb.org/t/p/w200/8suOhpMPdouGGD9eMSowFRkHuKg.jpg' },
      { name: 'C. Moss',       role: 'Trinity',     img: 'https://image.tmdb.org/t/p/w200/nKl37MFpaGrFnXZNGjb2fJrDvGr.jpg' },
      { name: 'H. Weaving',    role: 'Agent Smith', img: 'https://image.tmdb.org/t/p/w200/9sRFbwm1pLBM7tJVHN5gblpxKQW.jpg' },
    ],
  },
  {
    title: 'Jurassic Park',
    year: '1993',
    genres: ['Action', 'Sci-Fi'],
    rating: 4,
    section: 'elite',
    isFavorite: false,
    isHeart: false,
    synopsis: "Un milliardaire excentrique invite des paléontologues et d'autres experts à visiter son parc peuplé de dinosaures clonés. Mais quand le système de sécurité tombe en panne, la visite tourne au cauchemar.",
    comment: "Les T-Rex mécaniques de l'époque vieillissent mieux que 90% des films actuels en CGI. Spielberg était un génie absolu. Les enfants ? Un peu agaçants. Les dinos ? Parfaits.",
    posterUrl: 'https://image.tmdb.org/t/p/w500/i268GVIlp777W1Ykws5R3LYYLIw.jpg',
    actors: [
      { name: 'S. Neill',        role: 'Grant',   img: 'https://image.tmdb.org/t/p/w200/hXPaDtgdxbQ7mgD0gVnsMxCnWfv.jpg' },
      { name: 'L. Dern',         role: 'Sattler', img: 'https://image.tmdb.org/t/p/w200/rRfPOVm4zQjqBXAb7D5MNWCLBVh.jpg' },
      { name: 'J. Goldblum',     role: 'Malcolm', img: 'https://image.tmdb.org/t/p/w200/dSEaHBKlWCDxnJhMCu4hBh3kSR3.jpg' },
      { name: 'R. Attenborough', role: 'Hammond', img: 'https://image.tmdb.org/t/p/w200/lHe8iwkIBiCp0R6KmVkSSPFRvY.jpg' },
    ],
  },
  {
    title: 'Jurassic World',
    year: '2015',
    genres: ['Action', 'Sci-Fi'],
    rating: 3,
    section: 'moyen',
    isFavorite: false,
    isHeart: false,
    synopsis: "Vingt-deux ans après les événements tragiques du parc original, Jurassic World est enfin ouvert au public. Mais quand un nouveau dinosaure génétiquement modifié s'échappe, le chaos s'empare de l'île et les visiteurs courent un danger mortel.",
    comment: "Nostalgique mais prévisible. Le Indominus Rex est cool sur le papier mais l'écriture manque de mordant. Pratt est attachant, les enfants toujours agaçants. Un blockbuster honnête.",
    posterUrl: 'https://image.tmdb.org/t/p/w500/jjBgi2r5cRt36xF6iNUYhOrOSD9.jpg',
    actors: [
      { name: 'C. Pratt',     role: 'Owen Grady',   img: 'https://image.tmdb.org/t/p/w200/sHuIo8vWdNDEdrdTkJoFyqXsOTH.jpg' },
      { name: 'B. Howard',    role: 'Claire',        img: 'https://image.tmdb.org/t/p/w200/4Vb7jQWbJjAKDLihtJVhAVlYmNf.jpg' },
      { name: "V. D'Onofrio", role: 'Hoskins',       img: 'https://image.tmdb.org/t/p/w200/oVyCMJfHvVxEPfJblsFbhfLErm5.jpg' },
      { name: 'I. Khan',      role: 'Simon Masrani', img: 'https://image.tmdb.org/t/p/w200/3VDKOoKwmXDqhizSbOqTIlIiXYS.jpg' },
    ],
  },
  {
    title: 'Le Dîner de Cons',
    year: '1998',
    genres: ['Drame'],
    rating: 5,
    section: 'elite',
    isFavorite: true,
    isHeart: true,
    synopsis: "Pierre Brochant, éditeur parisien, participe chaque semaine à un dîner de cons où chaque invité amène un idiot. Il invite François Pignon, expert en maquettes d'allumettes. La soirée tourne au désastre pour Brochant.",
    comment: "Il s'appelle Juste Leblanc. Ah bon, il n'a pas de prénom ? Un classique absolu de la comédie française. Chaque réplique est une balle. Jacques Villeret est immortel dans ce rôle.",
    posterUrl: 'https://image.tmdb.org/t/p/w500/7ukFDHExWul2Zz3L0OH8CaZCp2Z.jpg',
    actors: [
      { name: 'J. Villeret',    role: 'F. Pignon',   img: 'https://image.tmdb.org/t/p/w200/bL8MUaxS1mq6LYrVLJRicBJ49Cr.jpg' },
      { name: 'T. Lhermitte',   role: 'P. Brochant', img: 'https://image.tmdb.org/t/p/w200/zyOoFImRdCkAXkjF7v2MCmGwNAH.jpg' },
      { name: 'F. Huster',      role: 'Leblanc',     img: 'https://image.tmdb.org/t/p/w200/vBkFvhBFoICUVWkXhEJMEzr2oMU.jpg' },
      { name: 'A. Villechaize', role: 'Meneaux',     img: 'https://image.tmdb.org/t/p/w200/5BvNIBTLGZnKIHmgDqzolPVULlj.jpg' },
    ],
  },
];

export default function Films({ onBack }) {
  const [films,  setFilms]  = useState(INITIAL_FILMS);
  const [filter, setFilter] = useState('tous');

  const toggleFavorite = title =>
    setFilms(f => f.map(m => m.title === title ? { ...m, isFavorite: !m.isFavorite } : m));

  const toggleHeart = title =>
    setFilms(f => f.map(m => m.title === title ? { ...m, isHeart: !m.isHeart } : m));

  const totalFilms  = films.length;
  const eliteCount  = films.filter(f => f.section === 'elite').length;
  const moyenneNote = (films.reduce((a, f) => a + f.rating, 0) / totalFilms).toFixed(1);

  const FILTERS = [
    { key: 'tous',     label: 'Tous',        count: films.length,                                   icon: null  },
    { key: 'favorite', label: 'Favoris',     count: films.filter(f => f.isFavorite).length,         icon: Star  },
    { key: 'heart',    label: 'Coups de ❤️', count: films.filter(f => f.isHeart).length,            icon: Heart },
    { key: 'elite',    label: 'Élite',       count: films.filter(f => f.section === 'elite').length, icon: null },
    { key: 'moyen',    label: 'Moyen',       count: films.filter(f => f.section === 'moyen').length, icon: null },
    { key: 'navet',    label: 'Navet',       count: films.filter(f => f.section === 'navet').length, icon: null },
  ];

  const filtered =
    filter === 'tous'     ? films :
    filter === 'favorite' ? films.filter(f => f.isFavorite) :
    filter === 'heart'    ? films.filter(f => f.isHeart) :
    films.filter(f => f.section === filter);

  const sectionColors = {
    elite:    'border-purple-500/60 text-purple-300 bg-purple-600/15',
    moyen:    'border-amber-400/60  text-amber-300  bg-amber-500/15',
    navet:    'border-rose-500/60   text-rose-300   bg-rose-600/15',
    favorite: 'border-yellow-400/60 text-yellow-300 bg-yellow-400/15',
    heart:    'border-red-500/60    text-red-300    bg-red-500/15',
  };

  return (
    <div
      className="flex-1 w-full relative min-h-screen"
      style={{ backgroundColor: 'var(--bg-color, #060606)' }}
    >
      {/* Filigrane */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Popcorn className="absolute top-[8%] right-[4%] opacity-[0.04] rotate-12"
          style={{ color: 'var(--accent-color)', width: 220, height: 220 }} strokeWidth={1} />
        <Clapperboard className="absolute bottom-[12%] left-[3%] opacity-[0.04] -rotate-6"
          style={{ color: 'var(--accent-color)', width: 180, height: 180 }} strokeWidth={1} />
        <Film className="absolute top-[50%] right-[2%] opacity-[0.03]"
          style={{ color: 'white', width: 260, height: 260 }} strokeWidth={1} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-10">

        {/* ── Bouton retour ── */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-white
              text-[11px] font-black uppercase tracking-widest mb-8
              transition-colors duration-200 group w-fit"
          >
            <ChevronLeft
              size={14}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            Retour au dashboard
          </button>
        )}

        {/* ── En-tête ── */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white uppercase leading-[0.9] mb-2">
                Films <br />DÉJÀ
                <span className="py-2 bg-[var(--accent-color)] text-[var(--bg-color)] inline-block mt-2">
                  VUS
                </span>
              </h1>
              <p className="text-slate-500 text-sm font-medium max-w-md mt-2">
                Ton archive personnelle. Chaque film noté, critiqué, immortalisé.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-stretch gap-0 border border-white/8 divide-x divide-white/8 shrink-0">
              {[
                { value: totalFilms,        label: 'Films vus' },
                { value: eliteCount,        label: 'Élites'    },
                { value: `${moyenneNote}★`, label: 'Moy. note' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center justify-center px-6 py-3 bg-white/[0.03]">
                  <span className="text-2xl font-black text-white leading-none mb-0.5">{value}</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 h-px w-full bg-white/8" />
        </div>

        {/* ── Filtres ── */}
        <div className="flex items-center gap-3 mb-10 flex-wrap">
          <SlidersHorizontal size={14} className="text-slate-600 shrink-0" />
          {FILTERS.map(({ key, label, count, icon: Icon }) => {
            const isActive = filter === key;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black
                  uppercase tracking-wider border transition-all duration-200
                  ${isActive
                    ? key === 'tous'
                      ? 'border-[var(--accent-color)] text-[var(--bg-color,#060606)] bg-[var(--accent-color)]'
                      : sectionColors[key]
                    : 'border-white/10 text-slate-500 bg-transparent hover:border-white/20 hover:text-slate-300'
                  }`}
              >
                {Icon && <Icon size={12} className={isActive ? '' : 'opacity-60'} />}
                {label}
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${isActive ? 'bg-white/20' : 'bg-white/8'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Grille de cards ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Film size={64} className="text-white/10 mb-4" strokeWidth={1} />
            <p className="text-white/20 font-black text-xl uppercase tracking-wider">
              Aucun film dans cette catégorie
            </p>
            <p className="text-slate-600 text-sm mt-2">
              Commence à noter des films pour les voir apparaître ici.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6" style={{ alignItems: 'flex-start' }}>
            {filtered.map((film, index) => (
              <MovieCard
                key={`${film.title}-${index}`}
                {...film}
                onToggleFavorite={() => toggleFavorite(film.title)}
                onToggleHeart={() => toggleHeart(film.title)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}