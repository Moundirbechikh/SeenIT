import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Palette } from 'lucide-react';

export default function NavFirst({ currentTheme, setCurrentTheme, themes }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuth   = location.pathname === '/auth';
  const isUser   = location.pathname === '/user';

  // ── Cycle de thème (mobile) ──
  const cycleTheme = () => {
    const idx = themes.findIndex(t => t.id === currentTheme.id);
    setCurrentTheme(themes[(idx + 1) % themes.length]);
  };

  return (
    <nav className="h-[90px] shrink-0 flex items-center justify-between
      px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-50 relative">

      {/* ── Logo ── */}
      <Link to="/" className="text-3xl font-black tracking-tighter flex items-center select-none">
        <span className="text-white transition-colors duration-1000">SeenIt</span>
        <span className="ml-1 transition-colors duration-1000"
          style={{ color: 'var(--accent-color)' }}>.</span>
      </Link>

      {/* ── Actions droite ── */}
      <div className="flex items-center gap-3 sm:gap-5">

        {/* Sélecteur de thème desktop */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border
          border-white/5 transition-colors duration-1000 shadow-lg"
          style={{ backgroundColor: 'var(--card-color)' }}>
          <Palette className="text-slate-400 mr-1" size={15} />
          {themes.map(theme => (
            <button
              key={theme.id}
              onClick={() => setCurrentTheme(theme)}
              title={theme.name}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                currentTheme.id === theme.id
                  ? 'ring-2 ring-white ring-offset-2 scale-110'
                  : 'opacity-40 hover:opacity-100'
              }`}
              style={{
                backgroundColor: theme.accent,
                ringOffsetColor: 'var(--card-color)',
              }}
            />
          ))}
        </div>

        {/* Cercle thème mobile — 1 seul cercle, click = thème suivant */}
        <button
          onClick={cycleTheme}
          title={`Thème : ${currentTheme.name} — cliquer pour changer`}
          className="sm:hidden w-7 h-7 rounded-full border-2 border-white/20
            hover:border-white/50 transition-all duration-300 active:scale-90 shrink-0"
          style={{ backgroundColor: currentTheme.accent }}
        />

        {/* Bouton Connexion — masqué sur /auth et /user */}
        {!isAuth && !isUser && (
          <button
            onClick={() => navigate('/auth')}
            className="text-sm font-bold text-white px-5 sm:px-6 py-2.5 rounded-lg
              border border-white/10 transition-all duration-300 whitespace-nowrap
              hover:bg-white/10"
            style={{ backgroundColor: 'var(--card-color)' }}
          >
            Connexion
          </button>
        )}
      </div>
    </nav>
  );
}