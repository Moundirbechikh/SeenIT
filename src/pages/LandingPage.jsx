import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard, Film, Ticket, PlayCircle, Star, Popcorn, Stamp, X } from 'lucide-react';
import Footer from '../components/Footer'; // <-- IMPORT DU FOOTER

// --- HELPER : classes texte adaptées au thème ---
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

const LandingPage = () => {
  const ts = useThemeStyles();
  const [mounted, setMounted] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);

  const funFacts = [
    "Fini le fameux : Attends, on l'a pas déjà vu celui-là ? au bout de 45 minutes.",
    "Arrête de chercher désespérément le nom de ce film avec le mec chauve là.",
    "La fin était un chef-d'œuvre... ou nulle ? Ne doute plus, note-le de suite.",
    "Prouve enfin à tes potes que tu avais prédit le twist dès la 1ère scène.",
    "Fini les débats. Ta critique fait loi, ton espace, tes règles."
  ];

  const classicMovies = [
    { title: "Titanic",       stars: 5, review: "Rose avait clairement de la place sur cette porte. Mais chef-d'œuvre, j'ai pleuré.", img: "https://image.tmdb.org/t/p/w500/vpsvHLkoeKUjceIMeNSqCp3xEyY.jpg" },
    { title: "Interstellar",  stars: 5, review: "Visuellement fou. J'ai rien compris à la 5ème dimension mais la musique sauve tout.", img: "https://image.tmdb.org/t/p/w500/1pnigkWWy8W032o9TKDneBa3eVK.jpg" },
    { title: "Jurassic Park", stars: 4, review: "Les T-Rex mécaniques de l'époque vieillissent mieux que 90% des films actuels en CGI.", img: "https://image.tmdb.org/t/p/w500/i268GVIlp777W1Ykws5R3LYYLIw.jpg" },
    { title: "Matrix",        stars: 5, review: "Pilule rouge direct. Ce film a redéfini ma vision de la réalité.", img: "https://image.tmdb.org/t/p/w500/pEoqbqtLc4CcwDUDqxmEDSWpWTZ.jpg" },
    { title: "Le Dîner de Cons",stars: 5, review: "Il s'appelle Juste Leblanc. Ah bon, il n'a pas de prénom ? Un classique absolu.", img: "https://image.tmdb.org/t/p/w500/7ukFDHExWul2Zz3L0OH8CaZCp2Z.jpg" }
  ];

  const [textIndex,  setTextIndex]  = useState(0);
  const [movieIndex, setMovieIndex] = useState(0);

  // Mobile : quelle card ticket est active (null | 'left' | 'right')
  const [activeTicket, setActiveTicket] = useState(null);
  // Mobile : quelle feature card est active (null | 0 | 1 | 2)
  const [activeFeature, setActiveFeature] = useState(null);

  useEffect(() => {
    setMounted(true);
    const textTimer  = setInterval(() => setTextIndex( p => (p + 1) % funFacts.length),      8000);
    const movieTimer = setInterval(() => setMovieIndex(p => (p + 1) % classicMovies.length), 8000);
    return () => { clearInterval(textTimer); clearInterval(movieTimer); };
  }, []);

  const featuresRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setFeaturesVisible(true); },
      { threshold: 0.2 }
    );
    if (featuresRef.current) observer.observe(featuresRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleTicket  = key  => setActiveTicket( p => p === key  ? null : key);
  const toggleFeature = idx  => setActiveFeature(p => p === idx  ? null : idx);

  // Ajout de flex flex-col pour que le footer se place bien en bas
  return (
    <div className="flex-1 w-full relative transition-colors duration-700 flex flex-col" style={ts.bgMain}>

      {/* Popcorns déco */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <Popcorn className="absolute top-[15%] left-[5%] opacity-20 animate-[float_6s_ease-in-out_infinite] rotate-12 text-[var(--accent-color)]"  size={48} strokeWidth={1} />
        <Popcorn className="absolute top-[40%] left-[45%] opacity-10 animate-[float_8s_ease-in-out_infinite_1s] -rotate-12 text-[var(--accent-color)]" size={64} strokeWidth={1} />
        <Popcorn className="absolute top-[20%] right-[10%] opacity-20 animate-[float_5s_ease-in-out_infinite_2s] rotate-45 text-[var(--accent-color)]"  size={40} strokeWidth={1} />
        <Popcorn className="absolute bottom-[20%] left-[25%] opacity-15 animate-[float_7s_ease-in-out_infinite_1.5s] -rotate-45 text-[var(--accent-color)]" size={56} strokeWidth={1} />
      </div>

      {/* ══════════════ SECTION 1 : HERO ══════════════ */}
      <section className="min-h-[calc(100vh-90px)] flex flex-col relative z-20">
        <main className="flex-1 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-center gap-12 w-full py-10 lg:py-0">

          {/* TEXTE HERO */}
          <div className={`flex-1 text-center lg:text-left transform transition-all duration-1000 ease-out ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-32 opacity-0'}`}>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-8" style={ts.textPrimary}>
              I've already <br className="hidden lg:block"/>
              <span className="py-4 inline-block transition-colors duration-1000 shadow-2xl px-2" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }}>
                SeenIt
              </span> before.
            </h1>

            <p className="text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium mb-10" style={ts.textSecondary}>
              L'espace minimaliste pour archiver les films que tu as vus. Retrouve tes souvenirs, lâche ta critique, et prouve à tes potes que tu avais raison sur la fin de ce thriller.
            </p>

            <div className="flex justify-center lg:justify-start">
              <Link to="/auth"
                className="flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:opacity-90 hover:-translate-y-1 shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
                style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }}>
                <PlayCircle size={24} />
                Créer mon espace
              </Link>
            </div>
          </div>

          {/* ─── DESKTOP : DOUBLE CARTES JUMELÉES ─── */}
          <div className={`hidden lg:flex flex-1 justify-center items-center relative h-[450px] w-full max-w-md mx-auto transform transition-all duration-1000 delay-300 ease-out ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-32 opacity-0'}`}>
            
            {/* 🎟️ TICKET 1 (Gauche) */}
            <div 
              className="absolute left-4 sm:left-12 w-56 h-80 sm:w-64 sm:h-[400px] border shadow-2xl flex flex-col items-center justify-center p-8 text-center transition-all duration-300 origin-bottom cursor-pointer -rotate-6 z-10 hover:rotate-0 hover:z-30 hover:scale-105"
              style={{ 
                clipPath: 'polygon(0 40px, 4px 34px, 1px 28px, 7px 20px, 3px 12px, 12px 6px, 20px 0, 100% 0, 100% 100%, 0 100%)',
                backgroundColor: 'var(--card-color)',
                borderColor: 'var(--border-subtle)'
              }}
            >
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full transition-colors duration-1000" style={ts.bgMain}></div>
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full transition-colors duration-1000" style={ts.bgMain}></div>
              <div className="absolute left-3 right-3 top-1/2 border-t-2 border-dashed" style={ts.borderSubtle}></div>
              
              <div className="absolute bottom-4 right-4 flex items-center justify-center opacity-40 rotate-[-15deg]" style={ts.textAccent}>
                <Stamp size={48} strokeWidth={1.5} />
                <span className="absolute text-[10px] font-black uppercase tracking-widest mt-1">Admit</span>
              </div>

              <div key={textIndex} className="relative z-10 animate-[fadeIn_0.5s_ease-out]">
                <p className="text-xl sm:text-2xl font-black tracking-tighter leading-snug p-2 rounded-lg" style={ts.textPrimary}>
                  <span className="text-3xl" style={ts.textAccent}>"</span>
                  {funFacts[textIndex]}
                  <span className="text-3xl" style={ts.textAccent}>"</span>
                </p>
              </div>
            </div>

            {/* 🎟️ TICKET 2 (Droite) */}
            <div 
              className="absolute right-4 sm:right-12 w-56 h-80 sm:w-64 sm:h-[400px] shadow-2xl overflow-hidden transition-all duration-300 origin-bottom cursor-pointer rotate-6 z-20 hover:rotate-0 hover:z-30 hover:scale-105 group border-2"
              style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-subtle)' }}
            >
              <img 
                key={classicMovies[movieIndex].img}
                src={classicMovies[movieIndex].img} 
                alt="Affiche classique" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                   style={{ background: 'linear-gradient(to top, var(--bg-color) 0%, transparent 100%)' }}>
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex gap-1 mb-2" style={ts.textAccent}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < classicMovies[movieIndex].stars ? 'currentColor' : 'none'} className={i >= classicMovies[movieIndex].stars ? 'opacity-30' : ''} />
                    ))}
                  </div>
                  <h3 className="font-bold text-xl mb-2" style={ts.textPrimary}>{classicMovies[movieIndex].title}</h3>
                  <p className="text-sm italic line-clamp-4 font-medium" style={ts.textSecondary}>
                    "{classicMovies[movieIndex].review}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── MOBILE : CARTES SUPERPOSÉES AU CENTRE ─── */}
          <div className={`lg:hidden flex justify-center items-center relative w-full h-[400px] mt-12 transform transition-all duration-1000 delay-300 ease-out ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>

            {/* Ticket gauche mobile — Superposé derrière à gauche */}
            <div
              onClick={() => toggleTicket('left')}
              className="absolute w-60 h-[360px] sm:w-64 sm:h-[400px] border shadow-2xl flex flex-col items-center justify-center p-6 sm:p-8 text-center transition-all duration-300 cursor-pointer select-none origin-bottom"
              style={{
                clipPath: 'polygon(0 40px, 4px 34px, 1px 28px, 7px 20px, 3px 12px, 12px 6px, 20px 0, 100% 0, 100% 100%, 0 100%)',
                transform: activeTicket === 'left' ? 'rotate(0deg) scale(1.05) translateY(-10px)' : 'rotate(-8deg) translateX(-15px)',
                backgroundColor: 'var(--card-color)',
                borderColor: activeTicket === 'left' ? 'color-mix(in srgb, var(--accent-color) 40%, transparent)' : 'var(--border-subtle)',
                zIndex: activeTicket === 'left' ? 30 : 10
              }}
            >
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full transition-colors duration-1000" style={ts.bgMain} />
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full transition-colors duration-1000" style={ts.bgMain} />
              <div className="absolute left-3 right-3 top-1/2 border-t-2 border-dashed" style={ts.borderSubtle} />
              
              <div className="absolute bottom-4 right-4 flex items-center justify-center opacity-40 rotate-[-15deg]" style={ts.textAccent}>
                <Stamp size={48} strokeWidth={1.5} />
                <span className="absolute text-[10px] font-black uppercase tracking-widest mt-1">Admit</span>
              </div>

              {/* Hint tap quand inactif */}
              {activeTicket !== 'left' && (
                <span className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded" style={{ backgroundColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
                  Appuyer
                </span>
              )}

              <div className="relative z-10 animate-[fadeIn_0.5s_ease-out]">
                <p className={`text-xl font-black tracking-tighter leading-snug p-2 rounded-lg transition-all duration-300 ${activeTicket === 'left' ? 'opacity-100' : 'opacity-60'}`} style={ts.textPrimary}>
                  <span className="text-2xl" style={ts.textAccent}>"</span>
                  {funFacts[textIndex]}
                  <span className="text-2xl" style={ts.textAccent}>"</span>
                </p>
              </div>
            </div>

            {/* Ticket droite mobile — Superposé devant à droite */}
            <div
              onClick={() => toggleTicket('right')}
              className="absolute w-60 h-[360px] sm:w-64 sm:h-[400px] shadow-2xl overflow-hidden transition-all duration-300 cursor-pointer select-none border-2 origin-bottom"
              style={{
                transform: activeTicket === 'right' ? 'rotate(0deg) scale(1.05) translateY(-10px)' : 'rotate(8deg) translateX(15px)',
                backgroundColor: 'var(--bg-color)',
                borderColor: activeTicket === 'right' ? 'color-mix(in srgb, var(--accent-color) 50%, transparent)' : 'var(--border-subtle)',
                zIndex: activeTicket === 'right' ? 30 : 20
              }}
            >
              <img key={classicMovies[movieIndex].img} src={classicMovies[movieIndex].img} alt="Affiche"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
                style={{ transform: activeTicket === 'right' ? 'scale(1.08)' : 'scale(1)' }} />

              {/* Overlay : visible uniquement quand actif */}
              <div
                className="absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(to top, var(--bg-color) 0%, transparent 100%)',
                  opacity: activeTicket === 'right' ? 1 : 0,
                }}
              >
                <div className="flex gap-1 mb-2" style={ts.textAccent}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < classicMovies[movieIndex].stars ? 'currentColor' : 'none'}
                      className={i < classicMovies[movieIndex].stars ? '' : 'opacity-30'} />
                  ))}
                </div>
                <h3 className="font-bold text-xl mb-2" style={ts.textPrimary}>{classicMovies[movieIndex].title}</h3>
                <p className="text-sm italic line-clamp-4 font-medium" style={ts.textSecondary}>"{classicMovies[movieIndex].review}"</p>
              </div>

              {/* Hint tap quand inactif */}
              {activeTicket !== 'right' && (
                <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[1px]" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded backdrop-blur-md" style={{ backgroundColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>
                    Appuyer
                  </span>
                </div>
              )}
            </div>
          </div>
        </main>
      </section>

      {/* ══════════════ SECTION 2 : FONCTIONNALITÉS ══════════════ */}
      <section
        ref={featuresRef}
        className="min-h-screen flex items-center py-20 relative transition-colors duration-1000"
        style={ts.bgMain}
      >
        <div className="max-w-7xl mx-auto px-6 w-full z-10">

          <div className={`text-center mb-16 transform transition-all duration-1000 ${featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-4xl font-black mb-4 tracking-tight" style={ts.textPrimary}>
              Pensé comme un <span className="transition-colors duration-1000" style={ts.textAccent}>Réalisateur</span>.
            </h2>
            <p className="text-lg font-medium" style={ts.textSecondary}>Pas d'algorithmes. Pas de pubs. Juste le cinéma tel que tu l'as vécu.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">

            {/* ── CARTE 1 : Le Clap ── */}
            <div
              onClick={() => toggleFeature(0)}
              className={`relative rounded-xl overflow-hidden shadow-2xl border
                transform transition-all duration-500 cursor-pointer
                md:hover:-translate-y-3 md:hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] group
                ${featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}
              `}
              style={{ 
                transitionDelay: '100ms',
                backgroundColor: 'var(--card-color)',
                borderColor: activeFeature === 0 ? 'color-mix(in srgb, var(--accent-color) 40%, transparent)' : 'var(--border-subtle)'
              }}
            >
              <div
                className="h-8 w-full flex relative transition-transform duration-300"
                style={{
                  backgroundColor: 'var(--border-subtle)',
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
                  transform: activeFeature === 0 ? 'rotate(-6deg)' : 'rotate(0deg)',
                  transformOrigin: 'bottom left',
                }}
              >
                <div className="absolute -left-1 -top-1 w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: 'var(--text-primary)' }} />
              </div>
              <div className="p-8">
                <Clapperboard
                  className="mb-6 transition-transform duration-300"
                  style={{ color: 'var(--accent-color)', transform: activeFeature === 0 ? 'scale(1.1)' : 'scale(1)' }}
                  size={32}
                />
                <h3 className="text-2xl font-bold mb-3 uppercase tracking-wider" style={ts.textPrimary}>Action Immédiate</h3>
                <p className="font-medium" style={ts.textSecondary}>Recherche TMDB ultra-optimisée. Trouve l'affiche et la date avant même d'avoir fini de taper le titre.</p>
              </div>
            </div>

            {/* ── CARTE 2 : Le Ticket ── */}
            <div
              onClick={() => toggleFeature(1)}
              className={`relative rounded-xl shadow-2xl border border-transparent
                transform transition-all duration-500 cursor-pointer
                md:hover:-translate-y-3 md:hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] group
                ${featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}
              `}
              style={{ 
                transitionDelay: '300ms',
                backgroundColor: 'var(--accent-color)',
                color: 'var(--text-inverse)'
              }}
            >
              <div
                className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full transition-all duration-500"
                style={{ backgroundColor: 'var(--bg-color)', transform: `translateY(-50%) scale(${activeFeature === 1 ? 1.25 : 1})` }}
              />
              <div
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full transition-all duration-500"
                style={{ backgroundColor: 'var(--bg-color)', transform: `translateY(-50%) scale(${activeFeature === 1 ? 1.25 : 1})` }}
              />
              <div
                className="absolute left-0 right-0 top-1/2 border-t-2 border-dashed transition-all duration-500"
                style={{ borderColor: 'var(--bg-color)', opacity: activeFeature === 1 ? 0.7 : 0.3 }}
              />
              <div className="p-8 pb-12">
                <Ticket
                  className="mb-6 transition-transform duration-500"
                  style={{ color: 'var(--text-inverse)', transform: activeFeature === 1 ? 'rotate(12deg) scale(1.1)' : 'rotate(0deg) scale(1)' }}
                  size={32}
                />
                <h3 className="text-2xl font-bold mb-3 uppercase tracking-wider text-inherit">Ton Siège VIP</h3>
                <p className="font-bold text-inherit opacity-80">Authentification rapide pour créer ta salle privée. Tes critiques n'appartiennent qu'à toi et c'est 100% sécurisé.</p>
              </div>
            </div>

            {/* ── CARTE 3 : La Pellicule ── */}
            <div
              onClick={() => toggleFeature(2)}
              className={`relative rounded-xl overflow-hidden shadow-2xl border
                transform transition-all duration-500 cursor-pointer
                md:hover:-translate-y-3 md:hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] group
                ${featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}
              `}
              style={{ 
                transitionDelay: '500ms',
                backgroundColor: 'var(--card-color)',
                borderColor: activeFeature === 2 ? 'color-mix(in srgb, var(--accent-color) 40%, transparent)' : 'var(--border-subtle)'
              }}
            >
              <div
                className="absolute left-2 top-0 bottom-0 w-3 border-y-[600px] border-dashed opacity-40 transition-transform duration-700 ease-out"
                style={{ borderColor: 'var(--bg-color)', transform: activeFeature === 2 ? 'translateY(-8px)' : 'translateY(0)' }}
              />
              <div
                className="absolute right-2 top-0 bottom-0 w-3 border-y-[600px] border-dashed opacity-40 transition-transform duration-700 ease-out"
                style={{ borderColor: 'var(--bg-color)', transform: activeFeature === 2 ? 'translateY(-8px)' : 'translateY(0)' }}
              />
              <div className="p-8 px-10">
                <Film
                  className="mb-6 transition-transform duration-500"
                  style={{ color: 'var(--accent-color)', transform: activeFeature === 2 ? 'rotate(90deg) scale(1.1)' : 'rotate(0deg) scale(1)' }}
                  size={32}
                />
                <h3 className="text-2xl font-bold mb-3 uppercase tracking-wider" style={ts.textPrimary}>Archives Légères</h3>
                <p className="font-medium" style={ts.textSecondary}>Architecture minimaliste sur MongoDB. On stocke le minimum pour que l'app réponde instantanément.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <Footer />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(var(--tw-rotate)); }
          50%      { transform: translateY(-20px) rotate(calc(var(--tw-rotate) + 10deg)); }
        }
      `}} />
    </div>
  );
};

export default LandingPage;