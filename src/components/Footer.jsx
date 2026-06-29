import React from 'react';
import { Film } from 'lucide-react';
import portfolioLogo from '../assets/logo.png'; 

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
            <h4 className="text-xl font-black font-logo py-2  tracking-tighter" style={{ color: 'var(--text-inverse)',backgroundColor: 'var(--accent-color)' }}>
              Powered by TMDB
            </h4>
          </div>
          <p className="text-xs font-bold leading-relaxed mb-5 opacity-70" style={{ color: 'var(--text-secondary)' }}>
            Cette plateforme utilise l'API TMDB pour récupérer l'intégralité des affiches et métadonnées cinématographiques. Tous les droits relatifs aux œuvres appartiennent à The Movie Database (TMDB) et à leurs propriétaires respectifs. 
          </p>
          <div className="inline-block px-4 py-2 rounded-lg text-[10px] lg:text-[12px] font-black uppercase tracking-tighter font-black border shadow-sm" 
               style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
            Projet à but strictement non commercial
          </div>
        </div>

        {/* ── COLONNE 3 : Portfolio / Crédits ── */}
{/* ── Attribution Portfolio ── */}
<div className="flex flex-col items-center md:items-end gap-3">
          <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Design & Code par
          </p>
          <a href="MON_LIEN_PORTFOLIO_ICI" target="_blank" rel="noopener noreferrer" 
             className="transition-transform duration-300 hover:scale-110 active:scale-95">
            <img 
              src={portfolioLogo} 
              alt="Mon Portfolio" 
              className="h-8 w-auto object-contain rounded-md shadow-sm border"
              style={{ borderColor: 'var(--border-subtle)' }}
            />
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