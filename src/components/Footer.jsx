import React from 'react';
import portfolioLogo from '../assets/logo.png'; // Vérifie que le chemin correspond à ton dossier

export default function Footer() {
  return (
    <footer className="w-full border-t transition-colors duration-700 relative z-20 mt-auto"
            style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-subtle)' }}>
      
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* ── Marque SeenIt ── */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="text-3xl font-black tracking-tighter flex items-center" style={{ color: 'var(--text-primary)' }}>
            SeenIt<span style={{ color: 'var(--accent-color)' }}>.</span>
          </span>
          <p className="text-xs font-medium mt-2 max-w-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Ton espace minimaliste pour archiver, noter et critiquer tes expériences cinématographiques.
          </p>
        </div>

        {/* ── Attribution TMDB ── */}
        <div className="flex flex-col items-center gap-3">
          <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" 
             className="transition-transform duration-300 hover:scale-105 active:scale-95">
            {/* Logo officiel de The Movie Database (TMDB) */}
            <img 
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" 
              alt="TMDB Logo" 
              className="h-4"
            />
          </a>
          <p className="text-[9px] font-bold uppercase tracking-widest text-center max-w-[250px]" style={{ color: 'var(--text-muted)' }}>
            Ce produit utilise l'API TMDB mais n'est ni approuvé ni certifié par TMDB.
          </p>
        </div>

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

      {/* ── Copyright Bas de page ── */}
      <div className="border-t py-5 text-center transition-colors duration-700" 
           style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--card-color)' }}>
        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} SeenIt. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}