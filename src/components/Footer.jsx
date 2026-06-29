import React from 'react';
import { Film } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative w-full border-t transition-colors duration-700 mt-auto overflow-hidden flex flex-col"
            style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-subtle)' }}>
      
      {/* ── BACKGROUND TEXT EFFECT ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none select-none opacity-[0.03] z-0">
        <span className="text-[22vw] font-black tracking-tighter leading-none whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
          SEENIT.
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">
        
        {/* ── COLONNE 1 : Marque SeenIt ── */}
        <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
          <span className="text-5xl font-black tracking-tighter flex items-center mb-4" style={{ color: 'var(--text-primary)' }}>
            SeenIt<span style={{ color: 'var(--accent-color)' }}>.</span>
          </span>
          <p className="text-sm font-bold opacity-80 leading-relaxed max-w-sm" style={{ color: 'var(--text-secondary)' }}>
            Ton espace VIP pour archiver, noter et critiquer tes films. 
            Pas d'algorithmes, juste ton propre casting.
          </p>
        </div>

        {/* ── COLONNE 2 : Disclaimer TMDB & Légal ── */}
        <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left border-y md:border-y-0 md:border-x py-8 md:py-0 md:px-10" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-3 mb-4">
            <Film size={24} style={{ color: 'var(--accent-color)' }} />
            <h4 className="text-xl font-black font-logo py-2  tracking-tighter" style={{ color: 'var(--text-primary)',backgroundColor: 'var(--card-color)' }}>
              Powered by TMDB
            </h4>
          </div>
          <p className="text-xs font-bold leading-relaxed mb-5 opacity-70" style={{ color: 'var(--text-secondary)' }}>
            Cette plateforme utilise l'API TMDB pour récupérer l'intégralité des affiches et métadonnées cinématographiques. Tous les droits relatifs aux œuvres appartiennent à The Movie Database (TMDB) et à leurs propriétaires respectifs. 
          </p>
          <div className="inline-block px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm" 
               style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
            Projet à but strictement non commercial
          </div>
        </div>

        {/* ── COLONNE 3 : Portfolio / Crédits ── */}
        <div className="md:col-span-3 flex flex-col items-center md:items-end text-center md:text-right">
           <h4 className="text-2xl font-black tracking-tighter mb-4" style={{ color: 'var(--text-primary)' }}>
             Le Développeur
           </h4>
           <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-60" style={{ color: 'var(--text-primary)' }}>
            Design & Code par
          </p>
          
          <a href="TON_LIEN_PORTFOLIO" target="_blank" rel="noopener noreferrer" 
             className="group relative px-6 py-3 rounded-xl border-2 font-black tracking-tighter text-sm transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_20px_rgba(0,0,0,0.15)] overflow-hidden"
             style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>
            <span className="relative z-10 group-hover:opacity-0 transition-opacity duration-300">
              Voir le Portfolio
            </span>
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--accent-color)' }}>
              Let's connect !
            </span>
          </a>
        </div>

      </div>

      {/* ── BARRE DE COPYRIGHT ── */}
      <div className="relative z-10 w-full border-t py-6 text-center transition-colors duration-700 flex flex-col sm:flex-row justify-between items-center px-6 lg:px-12" 
           style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--card-color)' }}>
        <p className="text-[11px] font-black uppercase tracking-widest opacity-60" style={{ color: 'var(--text-primary)' }}>
          © {new Date().getFullYear()} SeenIt.
        </p>
        <p className="text-[10px] font-bold tracking-widest opacity-40 mt-2 sm:mt-0" style={{ color: 'var(--text-primary)' }}>
          "I've already SeenIt before."
        </p>
      </div>
      
    </footer>
  );
}